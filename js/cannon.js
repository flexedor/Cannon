import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
export const cannon = (() => {

    class Cannon {

        constructor(params) {

            this.params_ = params;
            this.load();

        }


        load = () => {
            const loader = new GLTFLoader();
            this.gameObject = new THREE.Object3D();
            loader.load('Models/Boom_1.gltf', (gltf) => {
                console.log(gltf);
                this.gameObject=gltf;
                this.gameObject.scene.traverse( c=>{
                    c.castShadow=true;
                })
                this.gameObject.x=50;
                //this.gameObject.scene.scale.set(50,50,50);
                this.animationMixer=new THREE.AnimationMixer(this.gameObject.scene);
                this.idle=this.animationMixer.clipAction(this.gameObject.animations[0])
                this.idle.setLoop( THREE.LoopOnce );
                this.params_.scene.add(this.gameObject.scene);

            });



        };
        RetMixer=()=>{
            //console.log("Return")
            return this.animationMixer;
        }
        Shoot=()=>{
            //console.log(this.idle.loop);
            this.idle.stop();
            this.idle.play();
        }

        update(timeElapsed){
             // this.model.rotation.x += 0.1;
        }



    }

    return {
        Cannon: Cannon

    };
})();
