import * as BABYLON from 'babylonjs';
// import * as BABYLON from '@babylonjs/core/Legacy/legacy';

class BabylonCameraManager {
    static get DEFAULT_FOV(){return 0.8;}
    static get DEFAULT_CAMERA_ANIMATION_STEP(){return 0.05;}

    constructor(scene) {
        this.TAG = 'BabylonCameraManager';

        // Add a camera to the scene and attach it to the canvas
        let camera = this.getCamera(scene);
        this.refreshFrustum(camera,scene);
        scene.activeCamera = camera;
        camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

        //add lighting
        let light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 0, 1), scene);
        light.intensity = 0.7;
        light.parent = scene.activeCamera; //to follow active camera
        this.light = light;

        this.scene = scene;
    }

    updateBeforeRender(){
        if(this.togglePerspective !== undefined){
            const camera = this.scene.activeCamera;
            camera.detachControl(this.scene.getEngine().getRenderingCanvas());
            let value = camera.fov / BabylonCameraManager.DEFAULT_FOV;

            if(this.togglePerspective === 0){
                //animate to perspective
                camera.upperBetaLimit = Math.PI; // unlock beta before animate
                const finalValue = 1;
                const finalBetaAngle = Math.PI * 0.25;
                if(value === finalValue){
                    this.togglePerspective = undefined;
                    camera.attachControl(this.scene.getEngine().getRenderingCanvas(),true);
                }else{
                    value = value+BabylonCameraManager.DEFAULT_CAMERA_ANIMATION_STEP;
                    value = (value >finalValue)? finalValue : value;
                    camera.beta = finalBetaAngle * value;
                    this.dollyZoomCamera(camera,value);  
                }
            }else{
                //animate to ortho top-down
                const finalValue = 0.01;
                if(value === finalValue){
                    this.togglePerspective = undefined;
                    camera.upperBetaLimit = 0; //lock beta
                    camera.attachControl(this.scene.getEngine().getRenderingCanvas(),true);
                }else{
                    value = value - BabylonCameraManager.DEFAULT_CAMERA_ANIMATION_STEP;
                    value = (value < finalValue) ? finalValue : value;
                    camera.beta = camera.beta * (value-finalValue);
                    this.dollyZoomCamera(camera,value);  
                }
            }
            this.refreshFrustum(this.scene.activeCamera, this.scene);
        }

        if(this.followMesh !== undefined){
            let alpha   = this.scene.activeCamera.alpha;
            let beta    = this.scene.activeCamera.beta;
            this.scene.activeCamera.target = this.followMesh.position.clone();//not to use original one cos active camera will modify it when panning.
            this.scene.activeCamera.alpha = alpha;
            this.scene.activeCamera.beta = beta;
        }
    }

    getCamera(scene){
        let camera = new BABYLON.ArcRotateCamera("arcCamera", -Math.PI * 0.5, Math.PI * 0.25, 2, BABYLON.Vector3.Zero(), scene);
        camera.inertia = 0.5;
        camera.lowerRadiusLimit = 0.00001;
        camera.fov = BabylonCameraManager.DEFAULT_FOV;

        //camera.useFramingBehavior = true;
        //camera.mode = BABYLON.FramingBehavior.FitFrustumSidesMode;
        //camera.setTarget(root);
        
        return camera;
    }

    dollyZoomCamera(camera, value){
        const fov0 = camera.fov;
        const fov1 = BabylonCameraManager.DEFAULT_FOV*value;
        const factor = Math.tan(fov0*0.5) /  Math.tan(fov1*0.5);
        camera.radius = factor * camera.radius;
        camera.wheelPrecision = 100 / camera.radius;
        camera.fov = fov1;
        //console.log('fov='+fov1+", factor ="+factor);
    }

    resetView(){
        /*this.dollyZoomCamera(this.scene.activeCamera, 1);
        this.scene.activeCamera.upperBetaLimit = Math.PI;
        this.scene.activeCamera.beta = Math.PI * 0.25;
        this.scene.activeCamera.zoomOn([mesh], true);*/
        //this.scene.activeCamera.target = mesh;

        let worldExtends = this.scene.getWorldExtends();
        let worldSize = worldExtends.max.subtract(worldExtends.min);
        let worldCenter = worldExtends.min.add(worldSize.scale(0.5));
        let radius = worldSize.length() * 1.5;
        
        // empty scene scenario!
        if (!isFinite(radius)) {
            console.log('empty scene');
            radius = 1;
            worldCenter.copyFromFloats(0, 0, 0);
        }

        if(this.togglePerspective !== undefined){
            this.togglePerspective = undefined;
        }
        this.dollyZoomCamera(this.scene.activeCamera, BabylonCameraManager.DEFAULT_FOV);
        
        this.scene.activeCamera.target = worldCenter;
        this.scene.activeCamera.radius = radius;
        this.scene.activeCamera.lowerRadiusLimit = radius * 0.01;
        this.scene.activeCamera.wheelPrecision = 100 / radius;
        this.scene.activeCamera.minZ = radius * 0.01;
        this.scene.activeCamera.maxZ = radius * 1000;
        this.scene.activeCamera.speed = radius * 0.2;

        this.scene.activeCamera.alpha = Math.PI;
        this.scene.activeCamera.upperBetaLimit = Math.PI;
        this.scene.activeCamera.beta = Math.PI*0.25;

        this.scene.activeCamera.attachControl(this.scene.getEngine().getRenderingCanvas(),true);

    }

    refreshFrustum(camera, scene){
        
        /*const children = camera.getChildren();

        for(let i=0; i<children.length; i++){
            if(children[i] instanceof BABYLON.Mesh){
                children[i].dispose();
            }
        }

        const frustumPlanes = BABYLON.Frustum.GetPlanes(camera.getProjectionMatrix());

        let dirs = [];
        dirs.push(BABYLON.Vector3.Cross(frustumPlanes[4].normal,frustumPlanes[2].normal));  //leftup
        dirs.push(BABYLON.Vector3.Cross(frustumPlanes[2].normal,frustumPlanes[5].normal));  //leftdn
        dirs.push(BABYLON.Vector3.Cross(frustumPlanes[3].normal,frustumPlanes[4].normal));  //rightup
        dirs.push(BABYLON.Vector3.Cross(frustumPlanes[5].normal,frustumPlanes[3].normal));  //rightdn
        
        let nearPlanePoints = [];
        for(let i=0; i<dirs.length; i++){
            nearPlanePoints.push(dirs[i].scale(camera.minZ));
        }
        const nearPlaneLine = BABYLON.MeshBuilder.CreateLines(
            "lines", 
            {points: [nearPlanePoints[0],nearPlanePoints[2],nearPlanePoints[3],nearPlanePoints[1],nearPlanePoints[0]]}, 
            scene
        );
        nearPlaneLine.parent = camera;

        let farPlanePoints = [];
        for(let i=0; i<dirs.length; i++){
            farPlanePoints.push(dirs[i].scale(camera.maxZ));
        }
        const farPlaneLine = BABYLON.MeshBuilder.CreateLines(
            "lines", 
            {points: [farPlanePoints[0],farPlanePoints[2],farPlanePoints[3],farPlanePoints[1],farPlanePoints[0]]}, 
            scene
        );
        farPlaneLine.parent = camera;

        for(let i=0; i<farPlanePoints.length; i++){
            const frustumLine = BABYLON.MeshBuilder.CreateLines(
                "lines", 
                {points: [BABYLON.Vector3.Zero(), farPlanePoints[i]]}, 
                scene
            );
            frustumLine.parent = camera;
        }
        */
    }
}

export default BabylonCameraManager;