import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import {rigidBody}from'./rigidBody.js';
export const cannon = (() => {

    class Cannon {

        constructor(params) {

            this.params_ = params;
            this.load();

        }


        load = () => {
            this.rad=0;
            const loader = new GLTFLoader();
            this.gameObject = new THREE.Object3D();
            loader.load('Models/Boom_1.gltf', (gltf) => {
               // console.log(gltf);
                this.gameObject=gltf;
                this.gameObject.scene.traverse( c=>{
                    c.castShadow=true;
                })
                //this.gameObject.x=50;
                this.gameObject.scene.scale.set(5,5,5);
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
        Shoot=(physicsWorld_,rigid,camera)=>{
            this.physicsWorld_=physicsWorld_;
            //console.log(this.idle.loop);
            const rbBox = new rigidBody.RigidBody();
            const box = new THREE.Mesh(
                new THREE.SphereGeometry(4),
                new THREE.MeshStandardMaterial({color: 0x800000}));
            box.position.set(this.gameObject.position);
            rbBox.createSphere(1, box.position, 4);
            rbBox.setRestitution(0.5);
            rbBox.setFriction(1);
            rbBox.setRollingFriction(1);
            this.physicsWorld_.addRigidBody(rbBox.body_);
            this.params_.scene.add(box);
            rigid.push({mesh: box, rigidBody: rbBox});

            this.up = new THREE.Vector3();
            const scale=1000;
            camera.getWorldDirection(this.up)
            this.up.multiplyScalar(scale);
            this.up.y=-(scale/2)-this.up.y;
            rbBox.setLineralVelocity(this.up);
            this.idle.stop();
            this.idle.play();
        }

        update(timeElapsed){
            var axis = new THREE.Vector3(0,1,0);
            //this.rad += timeElapsed;
            this.gameObject.scene.setRotationFromMatrix(this.params_.camera.matrix)
            this.gameObject.scene.rotateY(Math.PI/2);

            //this.gameObject.scene.rotateOnWorldAxis(new THREE.Vector3(0,1,0),0) ;

            //this.gameObject.scene.rotate.y=0;
        }



    }

    return {
        Cannon: Cannon

    };
})();
