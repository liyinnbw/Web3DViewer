import { babylonViewer } from './babylon/babylonViewer';
class Main {

    constructor() {
        this.TAG = 'Main';
        this.init();
    }

    init() {
        // initialize singleton 3d viewer
        console.log(this.TAG, 'init babylon');
        babylonViewer.init();
        babylonViewer.show();
    }

    static printGraph() {

    }

    static loadModel(root, fileName){
        babylonViewer.loadModel(root, fileName);
    }

    static usePerspective(val) {
        babylonViewer.usePerspective(val);
    }

    static resetView() {
        babylonViewer.resetView();
    }
    
    static clearWorld() {
        babylonViewer.clearScene();
    }
    
    static shaderDefault() {
        babylonViewer.useDefaultShader();
    }
    static shaderXray() {
        babylonViewer.useXrayShader();
    }
}

export default Main;
