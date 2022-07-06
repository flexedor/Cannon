import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

export const ground = (() => {

  class Ground {
    constructor(params) {
		this.params_ = params;
	    this.load();
    }


    load = () => {
        const loader = new FBXLoader();
        loader.load('Models/island.fbx', (fbx) => {
        //fbx.position.y = -45;
        fbx.position.x = 0;
        fbx.position.z = 0;
        fbx.castShadow = true;
        fbx.receiveShadow = true;
        fbx.rotation.z = 0;
        fbx.rotation.y = 0;
        this.mesh_ = fbx

         fbx.scale.setScalar(0.1);
        this.params_.scene.add(fbx)

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



