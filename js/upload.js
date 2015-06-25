/*jslint jquery:true, devel:true*/

$(document).ready(function()
{
    $(function () {
        $('#fileupload').fileupload({
            dataType: 'json',

            //autoUpload: false,
            add: function (e, data) {
                $('#progress').css(
                    'width',
                    '0%'
                );
                data.submit();
            },
            
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log('progress bar',progress);
                $('#progress').css(
                    'width',
                    progress + '%'
                );
            },
            
            done: function (e, data) { 
                $.each(data.result.files, function (index, file) {
                    //$('<p/>').text(file.name).appendTo(document.body);
                    console.log('filename='.concat(file.name));
                    load(file.name);
                });
            },
            
            error: function (data, status, e) { 
                alert(e+"\r\n"+status.statusText+"\r\n"+data.responseText);
            }
                
        });
    });
});