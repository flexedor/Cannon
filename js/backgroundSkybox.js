import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
export const skybox = (() => {

    class Skybox {
        constructor(params) {

            this.params_ = params;
            this.load();
            this.ch = 0

        }


        load = () => {
            const loader = new THREE.CubeTextureLoader();
             this.texture = loader.load(this.createPathStrings());
        }
        createPathStrings=()=> {
            const basePath = "./pics/skybox/";
            const baseFilename = basePath;
            const fileType = ".bmp";
            const sides = ["rt", "lf", "up", "dn", "ft","bk"];
            const pathStings = sides.map(side => {
                return baseFilename + side + fileType;
            });
            return pathStings;
        }
        GetTexture=()=>{
            return this.texture;
        }

    }

    return {
        Skybox: Skybox

    };
})();
