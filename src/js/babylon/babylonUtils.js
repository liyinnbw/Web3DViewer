import * as BABYLON from 'babylonjs';
// import * as BABYLON from '@babylonjs/core/Legacy/legacy';
// import shaderXrayVert from './shaders/xray.vert';
// import shaderXrayUnTransVert from './shaders/xraynormal.vert';
// import shaderUnlitVert from './shaders/unlit.vert';;
// import shaderJustColorFrag from './shaders/justcolor.frag';
class BabylonUtils {
    static UpdateBoundingInfo (mesh){
        mesh.computeWorldMatrix(true);   //important
        mesh.refreshBoundingInfo();      //important
        let boundingInfo = (mesh.geometry !== undefined)? mesh.getBoundingInfo() : new BABYLON.BoundingInfo( BABYLON.Vector3.One().scaleInPlace(Number.MAX_VALUE),BABYLON.Vector3.One().scaleInPlace(Number.MIN_VALUE) );

        let children = mesh.getChildren();
        if(children.length == 0){
            return boundingInfo;
        }

        let min = boundingInfo.boundingBox.minimumWorld;
        let max = boundingInfo.boundingBox.maximumWorld;
        for(let i=0; i<children.length; i++){
            const childBoundingInfo = BabylonUtils.UpdateBoundingInfo(children[i]);
            min = BABYLON.Vector3.Minimize(min, childBoundingInfo.boundingBox.minimumWorld);
            max = BABYLON.Vector3.Maximize(max, childBoundingInfo.boundingBox.maximumWorld);
        }

        boundingInfo = new BABYLON.BoundingInfo(min, max);
        mesh.setBoundingInfo(boundingInfo);
        return boundingInfo;
    }

    static UpdateWorldExtend (scene){
        let worldExtends = scene.getWorldExtends();
        scene.root.setBoundingInfo(new BABYLON.BoundingInfo(worldExtends.min, worldExtends.max));
    }

    static GetXrayMaterialStandard(scene, color, contrast, intensity, isTransparent){
        let xray_mat = new BABYLON.StandardMaterial("xray", scene);
        xray_mat.diffuseColor = color;
        xray_mat.emissiveColor = new BABYLON.Color3(1, 1, 1).scale(intensity);
        let fresnel_params = new BABYLON.FresnelParameters();
        fresnel_params.isEnabled = true;
        fresnel_params.leftColor = color;
        fresnel_params.rightColor = BABYLON.Color3.Black();
        fresnel_params.power = 2;
        fresnel_params.bias = 0.1;
        if(isTransparent){
            xray_mat.alpha = 0.2;
            let fresnel_params2 = new BABYLON.FresnelParameters();
            fresnel_params2.isEnabled = true;
            fresnel_params2.leftColor = new BABYLON.Color3(1, 1, 1);
            fresnel_params2.rightColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            fresnel_params2.power = 2;
            fresnel_params2.bias = 0.5;
            xray_mat.opacityFresnelParameters = fresnel_params2;
        }
        xray_mat.emissiveFresnelParameters = fresnel_params;
        return xray_mat;

    }

    static GetUnlitMaterial(scene, color){
        let mat = new BABYLON.StandardMaterial("unlit", scene);

        // if(BABYLON.Effect.ShadersStore["unlitVertexShader"] === undefined){
        //     BABYLON.Effect.ShadersStore["unlitVertexShader"]= shaderUnlitVert; 
        //     console.log('loaded: unlitVertexShader');
        // }
        // if(BABYLON.Effect.ShadersStore["justcolorFragmentShader"] === undefined){
        //     BABYLON.Effect.ShadersStore["justcolorFragmentShader"]= shaderJustColorFrag;
        //     console.log('loaded: justcolorFragmentShader');
        // }
        // let mat = new BABYLON.ShaderMaterial("unlit", scene, 
        //     {
        //         vertex: "unlit",
        //         fragment: "justcolor",
        //     },
        //     {
        //         attributes: [   
        //                         "position", "normal", "uv",
        //                         "world0", "world1", "world2", "world3", //for instance
        //                         "matricesIndices", "matricesWeights",   //for bone animation
        //                     ],
        //         uniforms:   [ 
        //                         "world", 
        //                         "viewProjection",   //for instance
        //                         "mBones",           //for bone animation
        //                     ],
        //     }
        // );
        // mat.setColor3("color", color);

        return mat;
    }
    static GetXrayMaterial(scene, color, contrast, intensity, isTransparent){
        let mat = new BABYLON.StandardMaterial("unlit", scene);

        // //load shaders if not done so
        // if(BABYLON.Effect.ShadersStore["xrayVertexShader"] === undefined){
        //     BABYLON.Effect.ShadersStore["xrayVertexShader"]= shaderXrayVert; 
        //     console.log('loaded: xrayVertexShader');
        // }
        // if(BABYLON.Effect.ShadersStore["justcolorFragmentShader"] === undefined){
        //     BABYLON.Effect.ShadersStore["justcolorFragmentShader"]= shaderJustColorFrag;
        //     console.log('loaded: justcolorFragmentShader');
        // }
        
        // let mat;
        // if(isTransparent){
        //     mat = new BABYLON.ShaderMaterial("xray", scene, 
        //     {
        //         vertex: "xray",
        //         fragment: "justcolor"
        //     },
        //     {
        //         attributes: [   
        //                         "position", "normal", "uv",
        //                         "world0", "world1", "world2", "world3", //for instance
        //                         "matricesIndices", "matricesWeights",   //for bone animation
        //                     ],
        //         uniforms:   [ 
        //                         "world", 
        //                         "viewProjection",   //for instance
        //                         "mBones",           //for bone animation
        //                     ],
        //         needAlphaBlending: true,
        //         needAlphaTesting: false,    //default is false
        //     });
        //     mat.backFaceCulling = true;     //default is true
        //     mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
        // }else{
        //     mat = new BABYLON.ShaderMaterial("xray", scene, 
        //     {
        //         vertex: "xray",
        //         fragment: "justcolor"
        //     },
        //     {
        //         attributes: [   
        //                         "position", "normal", "uv",
        //                         "world0", "world1", "world2", "world3", //for instance
        //                         "matricesIndices", "matricesWeights",   //for bone animation
        //                     ],
        //         uniforms:   [ 
        //                         "world", //, "worldView", "worldViewProjection", "view", "projection",],
        //                         "viewProjection",   //for instance
        //                         "mBones",           //for bone animation
        //                     ],
        //     });
        // }

        // //additional uniforms
        // mat.setVector3("cameraPosition", scene.activeCamera.position);
        // mat.setFloat("intensity", intensity);   //brightness
        // mat.setFloat("contrast", contrast);   //contrast
        // mat.setColor3("color", color);
        return mat;
    }
    static GetXrayUnTransMaterial(scene, color, contrast, intensity, isTransparent){
        let mat = new BABYLON.StandardMaterial("unlit", scene);

        // //load shaders if not done so
        // if(BABYLON.Effect.ShadersStore["xraynormalVertexShader"] === undefined){
        //     BABYLON.Effect.ShadersStore["xraynormalVertexShader"]= shaderXrayUnTransVert; 
        //     console.log('loaded: xraynormalVertexShader');
        // }
        // if(BABYLON.Effect.ShadersStore["justcolorFragmentShader"] === undefined){
        //     BABYLON.Effect.ShadersStore["justcolorFragmentShader"]= shaderJustColorFrag;
        //     console.log('loaded: justcolorFragmentShader');
        // }
        
        // let mat;
        // if(isTransparent){
        //     mat = new BABYLON.ShaderMaterial("xraynormal", scene, 
        //     {
        //         vertex: "xraynormal",
        //         fragment: "justcolor"
        //     },
        //     {
        //         attributes: ["position", "normal", "uv"],
        //         uniforms: ["world", "worldView", "worldViewProjection", "view", "projection",],
        //         needAlphaBlending: true,
        //         needAlphaTesting: false,    //default is false
        //     });
        //     mat.backFaceCulling = true;     //default is true
        //     mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
        // }else{
        //     mat = new BABYLON.ShaderMaterial("xraynormal", scene, 
        //     {
        //         vertex: "xraynormal",
        //         fragment: "justcolor"
        //     },
        //     {
        //         attributes: ["position", "normal", "uv"],
        //         uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
        //     });
        // }

        // //additional uniforms
        // mat.setVector3("cameraPosition", scene.activeCamera.position);
        // mat.setFloat("intensity", intensity);   //brightness
        // mat.setFloat("contrast", contrast);   //contrast
        // mat.setColor3("color", color);
        return mat;
    }

    static Instantiate(prefab){
        /*let clone = prefab.clone(prefab.name);
        clone.isPickable = false;
        return clone;*/

        let instance = prefab.createInstance(prefab.name);
        instance.isPickable = false;
        instance.layerMask = prefab.layerMask;
        const children = prefab.getChildren();
        for(let i=0; i<children.length; i++){
            let childInstance = BabylonUtils.Instantiate(children[i]);
            childInstance.parent = instance;
        }

        return instance;
    }

    static SetPickable(mesh, val){
        mesh.isPickable = val;
        const children = mesh.getChildren();
        for(let i=0; i<children.length; i++){
            BabylonUtils.SetPickable(children[i], val);
        }
    }
}

export default BabylonUtils;