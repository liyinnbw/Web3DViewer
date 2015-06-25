/* jshint jquery:true, devel:true */
var spinner;
var container,stats;
var camera, scene, renderer;
var geometry;
var RATIO = 16.0/9.0;
var OFFSET = 40;
init();
animate();

function onWindowResize() {

    camera.aspect = RATIO;
    camera.updateProjectionMatrix();
    var width = container.clientWidth-OFFSET;
    var height= width/RATIO;
    renderer.setSize( width, height );

}

function init(){
    
    //renderer
    container = document.getElementById("viewer");
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xf0f0f0 ); //background
    renderer.setPixelRatio( window.devicePixelRatio );
    var width = container.clientWidth-OFFSET;
    var height= width/RATIO;
    renderer.setSize( width, height ); 
    container.appendChild( renderer.domElement );
    
    //stats
    stats = new Stats();
    //stats.domElement.style.position = 'absolute';
    //stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
    
    //camera
    camera = new THREE.PerspectiveCamera( 75, width / height, 0.001, 1000 ); 
    camera.position.z = 1;
    
    //lighting
    var ambient = new THREE.AmbientLight( 0x666666 );
    var light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    /*//light.shadowCameraVisible = true;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    var d = 300;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;
    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;*/
    
    //scene
    scene = new THREE.Scene();
    scene.add( ambient );
    scene.add( light );

    //var cube = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), material ); 
    //scene.add( cube ); 
    
    
    
    window.addEventListener( 'resize', onWindowResize, false );
    controls = new THREE.OrbitControls( camera );

}
function showSpinner(){
    var width = container.clientWidth-OFFSET;
    var height= width/RATIO;
    var spinnerWidth = 30;
    var top = (height/2-spinnerWidth);
    var marginLeft = -spinnerWidth;
    spinner = document.createElement( 'div' );
    spinner.className = 'spinner';
    spinner.setAttribute('style','position:absolute; top:'+top+'px; left: 50%; z-index:1; margin-left:'+marginLeft+'px;');
    container.appendChild(spinner);
}
function hideSpinner(){
    container.removeChild(spinner);
}
function load(filename){
    scene.remove(geometry); //remove previous geometry
    showSpinner();
    console.log('loading '.concat(filename));
    //material
    var clothTexture = THREE.ImageUtils.loadTexture( 'texture/pic.jpg' );
    var material = new THREE.MeshPhongMaterial( 
        { 
            alphaTest: 0.5, 
            color: 0xffffff, 
            specular: 0x030303, //0x333333
            emissive: 0x111111, 
            shiness: 50, 
            map: clothTexture, 
            shading: THREE.SmoothShading,
            wireframe: false,
            side: THREE.DoubleSide 
        }
    ); 
    
    //models
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    }; 

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'thirdparty/uploader/server/php/files/'.concat(filename), function ( object ) {
        object.traverse( function (child) {  
            if ( child instanceof THREE.Mesh ) {  
                child.material = material;  
                child.material.needsUpdate = true;  
            }  
        });
        geometry = object;
        fitWindow(geometry);
        scene.add(geometry);
        hideSpinner();
    }, onProgress, onError );
    
}
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
    //geometry.rotation.x += 0.01; 
    //geometry.rotation.y += 0.01;
}
function fitWindow(object){
    var box = new THREE.Box3().setFromObject( object );
    //var box = geometry.computeBoundingBox();
    
    var xLen = box.max.x-box.min.x;
    var yLen = box.max.y-box.min.y;
    var zLen = box.max.z-box.min.z;
    var zoomOut = Math.max(xLen,yLen,zLen);

    var sum = box.min.add(box.max);
    object.position.x -= sum.x/2.0;
    object.position.y -= sum.y/2.0;
    object.position.z -= sum.z/2.0;
    camera.position.z = zoomOut;
    
    
}