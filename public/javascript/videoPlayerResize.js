const videoPlayerResize = () => {
    let windowWidth = $(window).width();
    if (windowWidth === 1920) {
        $(".videoPlayer").width('1280px');
        $(".videoPlayer").height('720px');
    } else {
        let playerWidth = windowWidth*(1280/1920);
        $(".videoPlayer").width(`${playerWidth}px`);
        $(".videoPlayer").height(`${playerWidth/(16/9)}px`);
    }
}

videoPlayerResize();
$(window).resize(() => {
    videoPlayerResize();
});