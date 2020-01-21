import * as BABYLON from 'babylonjs';
import BabylonCameraManager from './babylonCameraManager';
import BabylonSceneManager from './babylonSceneManager';

class BabylonViewer{
    constructor() {
        this.TAG = 'BabylonViewer';
    }
    init() {
        this.container = document.getElementById('viewer-three');
        let canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.touchAction = 'none';
        canvas.oncontextmenu =  ()=> { return false; }; //disable right click menu
        this.container.appendChild(canvas);

        let engine          = new BABYLON.Engine(canvas, true); 
        let scene           = new BABYLON.Scene(engine);
        let cameraManager   = new BabylonCameraManager(scene);
        
        //let uiManager       = new BabylonUIManager();
        let sceneManager    = new BabylonSceneManager(scene, 
            (mesh)=>{ //on mesh picked callback
                cameraManager.followMesh = mesh;
                //uiManager.showMeshEditor(mesh);
            }
        );
        

        engine.runRenderLoop(() => { 
            // Register a render loop to repeatedly render the scene
            scene.render();
        });

        window.addEventListener("resize", () => { 
            // Watch for browser/canvas resize events
            engine.resize();
            cameraManager.refreshFrustum(scene.activeCamera, scene);
        });

        
        this.clock = {    
            before: performance.now(),    //milisecs
            getDelta() {        
                const now = performance.now();
                const delta = now - this.before;        
                this.before = now;        
                return delta;
            }
        }

        scene.registerBeforeRender(() => {
            cameraManager.updateBeforeRender();
            sceneManager.updateBeforeRender();
            //console.log(this.clock.getDelta());
        });

        this.canvas = canvas;
        this.scene = scene;
        this.engine = engine;
        this.sceneManager = sceneManager;
        this.cameraManager = cameraManager;
    }
    show() {
        this.container.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
        //this.engine.stopRenderLoop();
    }

    usePerspective(val){
        if(val){
            this.cameraManager.togglePerspective = 0;
        }else{
            this.cameraManager.togglePerspective = 1;
        }
    }

    resetView(){
        this.cameraManager.resetView();
    }

    
    loadModel(root, file){
        this.sceneManager.load(root, file, ()=>{
            this.cameraManager.resetView();
        });
    }

    clearScene(){
        this.sceneManager.clearScene();
    }
    useXrayShader(){
        this.sceneManager.useXrayShader();
    }
    useDefaultShader(){
        this.sceneManager.useDefaultShader();
    }

}

// Singleton, don't export default class
export const babylonViewer = new BabylonViewer();
