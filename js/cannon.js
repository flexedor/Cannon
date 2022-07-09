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
            const loader = new GLTFLoader();
            this.gameObject = new THREE.Object3D();
            loader.load('Models/cannonModel2/Boom.gltf', (gltf) => {
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
            //let tmpPos=;
            //tmpPos.x=(tmpPos.x+100);
            let position = new THREE.Vector3();
            position.getPositionFromMatrix( this.gameObject.scene.matrixWorld );
            box.position.set(position.x,position.y+25,position.z);

            rbBox.createSphere(0.1, box.position, 4);
            rbBox.setRestitution(0.5);
            rbBox.setFriction(1);
            rbBox.setRollingFriction(1);
            this.physicsWorld_.addRigidBody(rbBox.body_);
            this.params_.scene.add(box);
            box.userData.physicsBody=rbBox.body_;
            box.userData.tag="Bullet";
            rigid.push({mesh: box, rigidBody: rbBox});
            //console.log(box.position);
            this.up = new THREE.Vector3();
            const scale=100;
            camera.getWorldDirection(this.up)
            this.up.multiplyScalar(scale);
            //console.log( this.up);
            //this.up.y=-(scale/2)-this.up.y;
            this.up.y+=25;
           // console.log( this.up);
            rbBox.setLineralVelocity(this.up);
            this.idle.stop();
            this.idle.play();
        }


        update(timeElapsed){
            var axis = new THREE.Vector3(0,1,0);
            this.gameObject.scene.setRotationFromMatrix(this.params_.camera.matrix)
            this.gameObject.scene.rotateY(Math.PI/2);
        }



    }

    return {
        Cannon: Cannon

    };
})();
