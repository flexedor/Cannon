import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Water } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/objects/Water.js';
export const waterPlane = (() => {

    class WaterPlane {
        constructor(params) {
            this.params_ = params;
            this.load();
        }


        load = () => {
            const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
            this.texture1 = new Water(
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
            this.texture1.rotation.x =- Math.PI / 2;
            this.texture1.position.y= -50;
            this.params_.scene.add(this.texture1)
        };


        Update(timeElapsed){
            this.texture1.material.uniforms[ 'time' ].value += 1.0 / 60.0;

        }



    }

    return {
        WaterPlane: WaterPlane

    };
})();



