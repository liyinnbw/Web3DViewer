/*jslint jquery:true, devel:true*/
$('#registrationForm').hide();
$(document).ready(function()
{
    $('#loginBtn').click(function () {
    if($('#name').val().length==0 || $('#password').val().length==0){
        alert("Incomplete login user name or password!");}
    else
        window.location.replace("index.html");
    });
    $('#registerBtn').click(function () {
        $('#name').val("");
        $('#password').val("");
        $('#registrationForm').slideToggle();
    });
    $('#submitBtn').click(function () {
        if($('#inputName').val().length==0 || $('#inputEmail').val().length==0 || $('#inputPassword').val().length==0){
            window.alert("star field cannot be empty");}
        else
            $('#registrationForm').slideUp();
    });
});