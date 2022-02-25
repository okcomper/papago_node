const express = require("express"); // express 패키지 import

const app = express();


// API Key를 별도 관리 : dot(.)env활용, .env라는 파일에 key를 보관하고, dotenv가 .env파일을 활용해서, process.env객체에  포함시킴.
const dotenv = require('dotenv');
dotenv.config();

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

// node js 서버가 또다른 client가 되어 naver 서버에 요청을 보내기 위해 사용
const request = require("request");
const { response } = require("express");

// express의 static 미들웨어 활용.
app.use(express.static("public"))

// express의 json 미들웨어 활용.
app.use(express.json());

// root url : localhost:3000/ == localhost:3000
//해당 경로로 요청이 들어왔을때 호출될 함수
//두 인자값(arguments)을 받음 : requset(req), response(res)
app.get("/", (req, res) => {
//root urlㅡ 즉 메인페이지로 접속했을떄 papago의 메인 페이지로 들어와야함

// console.log(`현재 파일명: ${__filename}`);
// console.log(`index.html의 파일경로: ${__dirname}`);
//public/ ~

res.sendFile(__dirname, 'index.html');
});

// detectLangs 경로로 요청했을때
app.post("/detectLangs", (req, res) => {
 //'안녕'dlfks xprtmxmfmf qkedkdigka

  //번역 텍스트를 받아야함
  // console.log(text); //안녕
  console.log(req.body);
  console.log(typeof req.body); //object?

  const {text:query, targetLanguage} = req.body;

  const url = "https://openapi.naver.com/v1/papago/detectLangs";
  const options = {
    url,
    form:{ query },
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
      
    },
  };

  //options에 요청에 필요한 데이터 동봉.
  // ()=>{} : 요처엥 따른 응답 정보를 확인
  request.post(options, (error, response, body) =>{
    if(!error && response.statusCode == 200) {
      const parsedBody = JSON.parse(body); //parse() : string -> object변환
      console.log(typeof parsedBody, parsedBody);

      //papago 번역 url로 redirect(재요청)
      res.redirect(`translate?lang=${parsedBody['langCode']}&targetLanguage=${targetLanguage}&query=${query}`);//쿼리스트링 (query string)으로 데이터 전송(GET요청)
      // localhost:3000/translate?lang=ko&targetLanguage=en&query=안녕(%2D~~~~, 퍼센트 인코딩)

    } else{
      console.log(`error = ${response.statusCode}`);
    }
  });
});

//papago 번역 요청 부분.,
app.get("/translate", (req,res) => {
  const url = 'https://openapi.naver.com/v1/papago/n2mt';
  const options = {
    url,
    form:{
      source: req.query['lang'], //query string으로 받은 값들 mapping or biding
      target: req.query['targetLanguage'],
      text: req.query['query'],
    },
    headers :{
    "X-Naver-Client-Id": clientId,
    "X-Naver-Client-Secret": clientSecret,
  },
  }

  request.post(options, (error, response, body) => {
    if(!error && response.statusCode ==200){
      res.json(body); //front에 해당하는 script.js에 응답 데이터(json) 전송.
      console.log(body, typeof body);
     } else{
       console.log(`error = ${response.statusCode}`);
     }
  });
});

app.listen(3000, () => {
  console.log('http://127.0.0.1:3000/ app listening on port 3000');
});