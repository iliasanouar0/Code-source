$(document).on('click', '#add_frame', () => {
    console.log('working on it');
    $('<iframe src="http://google.com" frameborder="0" scrolling="no" id="myFrame"></iframe>').appendTo('.accordion');
})