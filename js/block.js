import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import {rigidBody}from'./rigidBody.js';

export const block = (() => {

    class Block {
        constructor(params) {

            this.params_ = params;
            this.boxs=[];
            //TODO rotate wall to player
            this.load();

            //-150,50,-200 top left corner
            //-30,0,-200 right bottom corner
        }


        load = () => {
            const loader = new GLTFLoader();
            this.gameObject = new THREE.Object3D();
            loader.load('Models/chest.gltf', (gltf) => {
                this.gameObject=gltf;
                this.gameObject.scene.traverse( c=>{
                    c.castShadow=true;})
                this.gameObject.scene.scale.set(5,5,5);
                this.gameObject.scene.rotateY(Math.PI/5);
                this.gameObject.userData.tag = "block";
                this.clonBlocks();
            });
        };
        clonBlocks=()=>{
            let stepX=-25;
            let stepY=25;
            let stepZ=10;
            let addX=-50;
            let addY=-25;
            let addZ=-30;
            for (var i = 0; i <this.params_.columns ; i++) {
                for (var j = 0; j <this.params_.columns ; j++) {
                    let clone= new THREE.Object3D();
                    // this.gameObject.scene.copy(clone);
                    clone.scene=this.gameObject.scene.clone();
                    clone.scene.position.set(stepX*(i+1)+addX,stepY*(j)+addY,-100+(stepZ*i)+addZ+10*i)
                   //clone.scene.children[0].position.set(stepX*(i+1),stepY*(j),-100+(stepZ*i))
                    clone.scale.set(5,5,5);
                    clone.scene.traverse( c=>{
                        c.castShadow=true;})
                    //console.log(new THREE.Box3().setFromObject(clone));
                    this.RigidBody= new rigidBody.RigidBody();
                    // this.RigidBody.createBox(0, clone.scene.position,clone.quaternion,
                    //     new THREE.Vector3(5,5,5));
                    this.RigidBody.createByGeometry(0,clone.scene.children[0].geometry, clone.scene.position,5)
                    this.RigidBody.setRestitution(0.99);
                    clone.userData.physicsBody =  this.RigidBody.body_;
                    clone.userData.tag = "Box";
                    //console.log(this.RigidBody);
                    this.params_.physicsWorld.addRigidBody(this.RigidBody.body_);
                    this.params_.scene.add(clone.scene);
                    this.boxs.push(clone);
                    this.params_.targets.push(clone);
                   // console.log(stepX*(i+1),stepY*(j),-100+(stepZ*i));
                }
            }
           // console.log(this.boxs);
        }

        Update(timeElapsed){
            if (this.boxs.length===0)return;
            let i=1;
            this.boxs.forEach((s)=>{
                s.scene.rotateY(Math.PI/(70+i));
                i+=2;
            })
          //  this.mesh_.rotation.x += 0.01;
        }



    }

    return {
        Block: Block

    };
})();


