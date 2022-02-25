const textAreaArray = document.querySelectorAll('textarea');
console.log(textAreaArray);

// 변수 네이밍 컨벤션, 용어 정의(도메인)
//왼쪽 번역할 텍스트박스는 source / 오른쪽 번역결과와 관련된 텍스트박스는 target

const [sourceTextArea, targetTextArea] = textAreaArray;
// console.log(sourceTextArea);
// console.log(targetTextArea);

const [sourceSelect, targetSelect] = document.querySelectorAll('select');
// console.log(sourceSelect, targetSelect);
// console.dir(targetSelect);

// 번역할 언어의 타입(ko? en? ja?)
let targetLanguage = 'en';
//'ko', 'ja'


// 어떤 언어로 번역할지 선택하는 target selectbox의 선택지 값이 바뀔때마다 이벤트 발생
targetSelect.addEventListener('change', () => {
    const selectedIndex = targetSelect.selectedIndex;
    // console.log(selectedIndex);

    targetSelect.options[selectedIndex].value;
    // console.log(targetLanguage);
});

let debouncer;

sourceTextArea.addEventListener('input', (event) => {
    
    if(debouncer){
        clearTimeout(debouncer);
    }

    debouncer = setTimeout(() =>{
           // 1. 어떤 이벤트인가?
        // 2. textarea에 입력한 값은 어떻게 가져올수있는가?
        const text = event.target.value; //textArea에 입력한 값 
        // console.log(text);
       if(text){
    
        // 이름만 XML일뿐! XML에 국한되진않음
        const xhr = new XMLHttpRequest();
    
        const url = '/detectLangs'; //node 서버의 특정 url 주소
    
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 & xhr.status == 200) {
                
                //서버 응답결과 확인(responseText : 응답에 포함된 텍스트)
                // console.log(typeof xhr.responseText);
                // console.log(xhr.responseText);
                const responseData = xhr.responseText;
                console.log(`responseData: ${responseData}, type: ${typeof responseData}`);
                const parseJsonToObject = JSON.parse(JSON.parse(responseData));
                // 두번 파싱해야하는 이유
                // https://stackoverflow.com/questions/30194562/json-parse-not-working/49460716
            
                console.log(typeof parseJsonToObject, parseJsonToObject);
    
                const result = parseJsonToObject['message']['result'];
                const options = sourceSelect.options;

                for(let i = 0; i< options.length; i++){
                    if(options[i].value === result['srcLangType']) {
                        sourceSelect.selectedIndex = i;
                    }
                }
    
                //번역된 텍스트를 결과하면에 입력
                targetTextArea.value = result['translatedText'];
    
    
                //응답의 헤더(header) 확인
                // console.log(`응답 헤더 : ${xhr.getAllResponseHeaders}`);
    
            }
        };

        /*
        * xhr.addEventlistener('load', () => { //로딩이 완료되었을때 실행
        * if (xhr.status === 200){}
        *  //내부코드는 동일
        *  }
        * });
        */
        
        //xhr : XMLHttpRequest
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-type", "application/json");
    
        const requestData = {// typeof : object
            text,
            targetLanguage
        };
        //JSON(javascript object notation의 타입은? String
        //내장 Json활용
        jsonToString = JSON.stringify(requestData); // JSON.stringify() : object -> string으로 변환해주는 함수 
        // console.log(typeof jsonToString);
        
        // console.log(typeof jsonToString)
        xhr.send(jsonToString);

       } else{
           console.log('번역할 텍스트를 입력하세요.');//
       }
    }, 3000);
});

