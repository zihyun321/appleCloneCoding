
// 즉시 호출 함수
(() => {
    // 모든 애니메이션에 대한 정보를 배열에 담아 두어야 한다.
    let yOffset = 0;            // window.pageYOffset 대신 사용할 변수  
    let prevScrollHeight = 0;   // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 위치의 합
    let currentScene = 0;       // 현재 활성화된 scene (scroll-section)

    const sceneInfo = [
        {   // 0
            type: 'sticky',
            scrollHeight: 0,    // 각 구간의 scroll 높이 정보 담고 있음
            heightNum: 5,       // ex 브라우저 높이의 5배
            objs: {
                container: document.querySelector('#scroll-section-0')
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
    }
    
    // 스크롤에 따라 활성화시킬 섹션(scene) 정하는 함수 (scroll 했을 때 실행됨)
    function scrollLoop() {
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        /**
         * 스크롤 올릴 땐, 해당 scene이 다 지나고 아래 scene이 나오게 해야하지만,
         * 스크롤 내릴 땐, 바로 위 scene 영역이 되자마자 위 scene이 나오게 해야해서 로직이 조금 다름 
         */
        // 스크롤 내릴 땐 (스크롤 증가), current scroll이 다시 증가해야함
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
        }

        // 스크롤 올릴 때(스크롤 감소)
        if (yOffset < prevScrollHeight) {
            if (currentScene === 0) return;
            currentScene--;
        }

        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    })

    window.addEventListener('load', setLayout);
    // 윈도우 사이즈 변경되면, 스크롤 높이도 변경되도록 설정
    window.addEventListener('resize', setLayout);
})();