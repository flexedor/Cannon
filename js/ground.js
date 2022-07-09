import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import {rigidBody}from'./rigidBody.js';

export const ground = (() => {

  class Ground {
    constructor(params) {
		this.params_ = params;
	    this.load();
    }


    load = () => {
        const loader = new GLTFLoader();
        this.gameObject = new THREE.Object3D();
        loader.load('Models/island.gltf', (gltf) => {
            this.gameObject=gltf;
            this.gameObject.scene.traverse( c=>{
                c.castShadow=true;
            })
            this.gameObject.scene.scale.set(5,5,5);
            this.params_.scene.add(this.gameObject.scene);

    });



	};


    Update(timeElapsed){
      //  this.mesh_.rotation.x += 1;
    }



  }

  return {
    Ground: Ground
      
  };
})();



