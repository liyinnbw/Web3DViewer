/*jslint jquery:true, devel:true*/

$(document).ready(function()
{
    $(function () {
        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    $('<p/>').text(file.name).appendTo(document.body);
                });
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log('progress bar',progress);
                $('#progress').css(
                    'width',
                    progress + '%'
                );
            }
        });
    });
});