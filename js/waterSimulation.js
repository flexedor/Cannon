import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Water } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/objects/Water.js';
import {rigidBody} from "./rigidBody.js";
export const waterPlane = (() => {

    class WaterPlane {
        constructor(params) {
            this.params_ = params;
            this.load();
        }


        load = () => {
            let scale = {x: 10000, y: 10000, z: 5};
            const waterGeometry = new THREE.BoxGeometry(scale.x, scale.y,scale.z);
            waterGeometry.castShadow = false;
            waterGeometry.receiveShadow = true;
            this.mesh_ = new Water(
                waterGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg', function ( texture ) {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    }),
                    alpha: 1.0,
                    waterColor: 0x001e0f,
                   // fog: scene.fog !== undefined
                }
            );
            this.mesh_.rotation.x =- Math.PI / 2;
            this.mesh_.position.y= -50;
            const rbGround = new rigidBody.RigidBody();
            rbGround.createBox(0, this.mesh_.position, this.mesh_.quaternion, new THREE.Vector3(scale.x, scale.y,scale.z));
            rbGround.setRestitution(0.99);
            this.params_.physicsWorld.addRigidBody(rbGround.body_);
            this.params_.scene.add(this.mesh_)
        };


        Update(timeElapsed){
            this.mesh_.material.uniforms[ 'time' ].value += 1.0 / 60.0;

        }



    }

    return {
        WaterPlane: WaterPlane

    };
})();



