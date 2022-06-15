
// 즉시 호출 함수
(() => {
    // 모든 애니메이션에 대한 정보를 배열에 담아 두어야 한다.
    let yOffset = 0;                // window.pageYOffset 대신 사용할 변수  
    let prevScrollHeight = 0;       // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 위치의 합
    let currentScene = 0;           // 현재 활성화된 scene (scroll-section)
    let enterNewScene = false;      // 새로운 scene이 시작되는 순간 true

    const sceneInfo = [
        {   // 0
            type: 'sticky',
            scrollHeight: 0,    // 각 구간의 scroll 높이 정보 담고 있음
            heightNum: 5,       // ex 브라우저 높이의 5배
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            // 위 objs안에 있는 값들중 어떤 값을 보여줄지 설정하는 요소
            values: {
                messageA_opacity: [0, 1]
            }
        },
        {   // 1
            type: 'normal',
            scrollHeight: 0,    
            heightNum: 5,       
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {   // 2
            type: 'sticky',
            scrollHeight: 0,    
            heightNum: 5,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }      
        },
        {   // 3
            type: 'sticky',
            scrollHeight: 0,   
            heightNum: 5,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }      
        },
    ];

    //  각 scroll 섹션의 높이 세팅
    function setLayout() {
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // setLayout에서도 current 자동으로 세팅해주어야 함 (왜???? [현재 활성 씬 반영하기 중간부터])
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    
    // scene 안에 있는 존재하는 요소들 각각의 위치에 따라 css를 설정하기 위한 함수
    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 scene에서 스크롤 된 범위를 비율로 구하기
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        return rv;
    }

    // 스크롤에 따라 애니메이션 설정
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;  // 해당 scene에서 어떤 위치를 가지고 있는지 파악하기 위한 변수
        console.log('currentScene: ', currentScene);
        switch (currentScene) {
            case 0:
                // 글자 나타날 때, css
                let messageA_opacity_in = calcValues(values.messageA_opacity,currentYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                console.log('messageA_opacity_in: ', messageA_opacity_in);
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;                    
        }
    }

    // 스크롤에 따라 활성화시킬 섹션(scene) 정하는 함수 (scroll 했을 때 실행됨)
    function scrollLoop() {
        prevScrollHeight = 0;
        enterNewScene = false;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        /**
         * 스크롤 올릴 땐, 해당 scene이 다 지나고 아래 scene이 나오게 해야하지만,
         * 스크롤 내릴 땐, 바로 위 scene 영역이 되자마자 위 scene이 나오게 해야해서 로직이 조금 다름 
         */
        // 스크롤 내릴 땐 (스크롤 증가), current scroll이 다시 증가해야함
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        // 스크롤 올릴 때(스크롤 감소)
        if (yOffset < prevScrollHeight) {
            if (currentScene === 0) return;     // 브라우저 바운스 효과로 인해 마이너스 되는 것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;              // scene 바뀌는 순간에 animation이 이상한 값이 출력되는 것을 방지하기 위한 것
        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    })

    // load되면 실행되도록 (+ load 대신 DOMContentLoaded 사용할 수 있음)
    window.addEventListener('load', setLayout);
    // 윈도우 사이즈 변경되면, 스크롤 높이도 변경되도록 설정
    window.addEventListener('resize', setLayout);
})();