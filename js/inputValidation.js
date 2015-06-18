/*jslint jquery:true, devel:true*/
$(document).ready(function()
{
    $('#loginBtn').click(function () {
    if($('#username').val().length<=0 || $('#password').val().length<=0){
        alert("Incomplete login user name or password!");}
    })
                             
    $('#sendBtn').click(function () {
    if($('#replyContent').val().length<=0){
        alert("Cannot send empty reply");}
    })
    $('#createGroupBtn').click(function () {
        $('#inputGroupName').val("");
        $('#createGroupForm').slideToggle();
    });
    $('#createBtn').click(function () {
        if($('#inputGroupName').val().length==0){
            window.alert("group name cannot be empty");}
        else
            $('#createGroupForm').slideUp();
    });
    $('#createPostBtn').click(function () {
        $('#inputPostTitle').val("");
        $('#createPostForm').slideToggle();
    });
    $('#postBtn').click(function () {
        if($('#inputPostTitle').val().length==0){
            window.alert("post title cannot be empty");}
        else
            $('#createPostForm').slideUp();
    });
})