const user = JSON.parse(sessionStorage.user);
console.log('welcome to settings');

$(document).on('click', '#add_table', () => {
    $('.add_table').modal('show')
})