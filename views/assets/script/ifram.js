$(document).on('click', '#add_frame', event => {
    console.log('working on it');
    $('<iframe src="http://209.170.73.224/NewReportingApp/views/mailer/process/" frameborder="0" scrolling="no" id="myFrame"></iframe>').appendTo('.newFrame');
    $(event.target).remove()
})