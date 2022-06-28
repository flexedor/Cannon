import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const block = (() => {

    class Block {
        constructor(params) {

            this.params_ = params;
            this.load();
            this.ch = 0

        }


        load = () => {
            const loader = new FBXLoader();
            loader.load('Models/block.fbx', (fbx) => {
                fbx.scale.setScalar(1);
               //  fbx.quaternion.setFromAxisAngle(
               //      new THREE.Vector3(1, 1, 1), Math.PI / 1);
                this.mesh_ = fbx;
                this.mesh_.position.x=0;
                this.mesh_.position.y=100;
                this.mesh_.position.z=0;
                this.params_.scene.add(this.mesh_);


            });

        };


        Update(timeElapsed){
          //  this.mesh_.rotation.x += 0.01;
        }



    }

    return {
        Block: Block

    };
})();


