import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import {cannon} from './cannon.js';
import {skybox} from './backgroundSkybox.js';
import {block} from './block.js';
import {waterPlane} from './waterSimulation.js';
import {ground} from './ground.js';




class BasicWorldDemo {

  constructor() {
    this._Initialize();

    this._gameStarted = false;
    document.getElementById('game-menu').onclick = (msg) => this._OnStart(msg);
  }

  _OnStart(msg) {
    document.getElementById('game-menu').style.display = 'none';
    document.getElementById('game-menu1').style.display = 'none';
    this._gameStarted = true;
  }

  _Initialize() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.mixers=[];
    this.gameObjects=[];
    this.threejs_.outputEncoding = THREE.sRGBEncoding;
    this.threejs_.gammaFactor = 2.2;
    
    this.threejs_.shadowMap.enabled = true;

    this.threejs_.setPixelRatio(window.devicePixelRatio);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('container').appendChild(this.threejs_.domElement);

    window.addEventListener('resize', () => {
      this.OnWindowResize_();
    }, false);
   // document.addEventListener('keydown', (e) =>console.log(e.key), false);
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 20000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(100, 100, 100);
    this.camera_.lookAt(0, 0, 0);

    this.scene_ = new THREE.Scene();


    const color = 0xFFFFFF;
    const intensity = 10;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.x = 12000
    light.position.y = 30000

    //console.log(light.position)
    this.scene_.add(light);


    this._controls = new OrbitControls(
    this.camera_, document.getElementById('container'));
    this._controls.target.set(0, 10, 0);
    this._controls.enablePan=false;
    this._controls.maxDistance=5000;
    this._controls.update();


    this.water=new waterPlane.WaterPlane({scene: this.scene_});
    this.ground = new ground.Ground({scene: this.scene_});
   // this.block = new block.Block({scene: this.scene_});
    this.scene_.background=new skybox.Skybox({scene: this.scene_}).GetTexture();
    this.gameObjects.push(new cannon.Cannon({scene: this.scene_}));

    document.addEventListener('keydown', (e) =>this.OnKeyDown(e), false)
    this.gameOver_ = false;
    this.previousRAF_ = null;
    this.RAF_();
    this.OnWindowResize_();
  }
  OnKeyDown(event){
    switch (event.code) {
      case "Space":
        this.gameObjects.forEach((s)=>{
          s.Shoot()
          console.log("shoot")
        });
        break;
    }

  }

  OnWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  RAF_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.RAF_();

      this.Step_((t - this.previousRAF_) / 1000.0);
      this._controls.update();
      this.threejs_.render(this.scene_, this.camera_);
      this.previousRAF_ = t;
    });
  }

  Step_(timeElapsed) {
    if (this.gameOver_ || !this._gameStarted) {
      return;
    }
    if (this.mixers.length===0) {
      this.gameObjects.forEach((gameObj)=>{
        this.mixers.push(gameObj.RetMixer())});
    }else{
      this.mixers.forEach((s)=>s.update(timeElapsed));
    }

    this.gameObjects.forEach((gameObj)=>gameObj.update());
    this.ground.Update(timeElapsed);
    this._controls.update();
    this.water.Update(timeElapsed);
    // if (this.player_.gameOver && !this.gameOver_) {
    //   this.gameOver_ = true;
    //   document.getElementById('game-over').classList.toggle('active');
    // }
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldDemo();
});


