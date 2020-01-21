import * as BABYLON from 'babylonjs';
import BabylonUtils from './babylonUtils';
import 'babylonjs-loaders';


class BabylonSceneManager {
    constructor(scene, onMeshPicked) {
        this.TAG = 'BabylonSceneManager';
        scene.clearColor    = BABYLON.Color3.Black();
        // scene.debugLayer.show();
        
        scene.root = new BABYLON.Mesh("root", scene);//new BABYLON.TransformNode("root", scene);//
        scene.root.showBoundingBox = true;
        scene.root.isPickable = false;

        scene.onPointerDown = (evt, pickResult) => {
            if (pickResult.hit){
                //console.log(pickResult.pickedMesh.uniqueId);
            }
        };

        this.scene = scene;
    }

    updateBeforeRender(){
        //BabylonUtils.UpdateBoundingInfo(this.scene.root);
        BabylonUtils.UpdateWorldExtend(this.scene);
    }

    load(fileRoot, file, onSuccessCallback){
        console.log(fileRoot+file);
        this.clearScene();

        /*BABYLON.SceneLoader.Append(fileRoot, file, this.scene, (scene) =>{
            //this will replace the current arcCamera with a new one
            scene.createDefaultCameraOrLight(true, true, true);
            console.log(scene.activeCamera);

            // The default camera looks at the back of the asset.
            // Rotate the camera by 180 degrees to the front of the asset.
            scene.activeCamera.alpha = Math.PI;   
                 
        });*/
        

        
        const mat = BabylonUtils.GetXrayMaterialStandard(this.scene, new BABYLON.Color3(0.5,0.5,1.0), 2.0, 1.0, true);
        
        // The first parameter can be used to specify which mesh to import. 
        // Here we import all meshes: ""
        BABYLON.SceneLoader.ImportMesh("", fileRoot, file, this.scene, 
            (newMeshes) => {    //on success
                console.log('success. mesh count = '+newMeshes.length);
                for(let i=0; i<newMeshes.length; i++){
                    //newMeshes[i].material.dispose(true);
                    newMeshes[i].material = mat;
                    //newMeshes[i].showBoundingBox = true;
                    newMeshes[i].scaling = new BABYLON.Vector3(1,1,-1);
                    newMeshes[i].parent = this.scene.root;
                    newMeshes[i].isPickable = true;
                    //newMeshes[i].showSubMeshesBoundingBox = true;
                }
                BabylonUtils.UpdateWorldExtend(this.scene);
                
                if(onSuccessCallback){
                    onSuccessCallback();
                }
            },
            (progressEvent) =>{ //on progress
                console.log('onprogress: '+(progressEvent.loaded/progressEvent.total*100)+'%');
            },
            (scene, message) =>{//on error
                console.log('error:'+message);
            }
        );
        
        
    }

    clearScene(){
        let children = this.scene.root.getChildren();
        for(let i=0; i<children.length; i++){
            children[i].dispose();
        }
    }

    useXrayShader(){
        const mat = BabylonUtils.GetXrayMaterialStandard(this.scene, new BABYLON.Color3(0.5,0.5,1.0), 2.0, 1.0, true);
        
        const meshes = this.scene.meshes;
        for(let i=0; i<meshes.length; i++){
            meshes[i].material = mat;
        } 
    }

    useDefaultShader(){
        const mat = new BABYLON.StandardMaterial("default", this.scene);

        const meshes = this.scene.meshes;
        for(let i=0; i<meshes.length; i++){
            meshes[i].material = mat;
        } 
    }
}

export default BabylonSceneManager;