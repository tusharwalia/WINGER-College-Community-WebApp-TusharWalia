$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {

        console.log('inside chat sidebar');
        $('#sidebar').toggleClass('active');
    });
});
