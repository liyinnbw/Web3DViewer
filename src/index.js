import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/custom.css';
import './css/spinner.css';
import Main from './js/main';


$(document).ready(() => {
    const main = new Main(); // eslint-disable-line no-unused-vars
    console.log(__webpack_public_path__); // server public root
    $('#load_btn').click(()=>{
        const url = document.getElementById('file_url').value;
        const filename = url.split('/').pop();
        const urlpath = url.substring(0,url.length-filename.length);
        // console.log(url);
        console.log(urlpath);
        console.log(filename);
        Main.loadModel(urlpath,filename);
    });

    $('#file_open_model').change(() => {
        const files = document.getElementById('file_open_model').files; //cant get this from $(this).prop('files');

        console.log(files[0].name);
        // const fileName = $(this).val().split('/').pop()
        //     .split('\\')
        //     .pop();
        // $(this).val('');
        // if (fileName === '') {
        //     return;
        // }
        // const root = '/';

        // let formData = new FormData();
        // formData.append('myFile', files[0], files[0].name);
        // let xhr = new XMLHttpRequest();
        // xhr.open('POST', root , true);

        // xhr.onload = function () {
        //     if (xhr.status === 200) {
        //         alert('File successfully uploaded');
        //         Main.loadModel(root, files[0].name);
        //     } else {
        //         alert('File upload failed!');
        //     }
        // };
        // xhr.send(formData);

        Main.loadModel('https://raw.githubusercontent.com/liyinnbw/sharefile/master/','bunny2.obj')
        
    });

    $('#file_scene_graph').click(() => {
        Main.printGraph();
    });
    $('#view_3d').click(() => {
        Main.usePerspective(true);
    });
    $('#view_2d').click(() => {
        Main.usePerspective(false);
    });
    $('#view_reset').click(() => {
        Main.resetView();
    });
    $('#file_new_scene').click(() => {
        Main.clearWorld();
    });

    $('#shader_default').click(() => {
        Main.shaderDefault();
    });
    $('#shader_xray').click(() => {
        Main.shaderXray();
    });
    
    $('[data-toggle="tooltip"]').tooltip();
});

