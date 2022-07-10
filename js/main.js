import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/stats.module.js';

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
    this.OnWindowResize_();
    this._gameStarted = true;
  }

  _Initialize() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.cameraPos = new THREE.Vector3(120,50,120);

    this.score=0;
    this.winScore=5;
    this.loseScore=-2;


    this.isReturnCameraOnPlace=false;
    this.isInShoot=false;

    this.gameObjects=[];
    this.bullets_ = [];
    this.targets=[];
    this.mixers=[];
    //num of objects in game
    this.numOfColumns=3;
    this.numOfRows=3;


    document.getElementById('container').appendChild(this.threejs_.domElement);
    this.scene_ = new THREE.Scene();
    this.initCamera();
    this.initPhysics();
    this.initControls();
    this.initLight();
    this.initGameObjects();

    document.addEventListener('keydown', (e) =>this.OnKeyDown(e), false)
    this.gameOver_ = false;
    this.previousRAF_ = null;
    this.tmpTransform_ = new Ammo.btTransform();
    this.RAF_();
    this.OnWindowResize_();
  }
  initGameObjects(){
    this.water=new waterPlane.WaterPlane({scene: this.scene_,physicsWorld:this.physicsWorld_});
    this.ground = new ground.Ground({scene: this.scene_});
    this.block = new block.Block({scene: this.scene_,columns:this.numOfColumns,targets:this.targets,rows:this.numOfRows,physicsWorld:this.physicsWorld_});
    this.scene_.background=new skybox.Skybox({scene: this.scene_}).GetTexture();
    this.gameObjects.push(new cannon.Cannon({scene: this.scene_,camera:this.camera_}));
  }
  initLight(){
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.x = 12000
    light.position.y = 30000

    //console.log(light.position)
    this.scene_.add(light);
  }
  initCamera(){

    this.threejs_.outputEncoding = THREE.sRGBEncoding;
    this.threejs_.gammaFactor = 2.2;

    this.threejs_.shadowMap.enabled = true;

    this.threejs_.setPixelRatio(window.devicePixelRatio);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
      this.OnWindowResize_();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 20000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.cameraPos = new THREE.Vector3(120,50,120);
    this.camera_.position.set( this.cameraPos.x,this.cameraPos.y,this.cameraPos.z);
    this.camera_.lookAt(0, 0, 0);
  }
  initPhysics() {

    // Physics configuration
    this.collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher_ = new Ammo.btCollisionDispatcher(this.collisionConfiguration_);
    this.broadphase_ = new Ammo.btDbvtBroadphase();
    this.solver_ = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld_ = new Ammo.btDiscreteDynamicsWorld(
        this.dispatcher_, this.broadphase_, this.solver_, this.collisionConfiguration_);
    this.physicsWorld_.setGravity(new Ammo.btVector3(0, -100, 0));
    this.setupContactPairResultCallback();
  }

  setupContactPairResultCallback(){
    //configuration of collition detector
    this.cbContactPairResult = new Ammo.ConcreteContactResultCallback();

    this.cbContactPairResult.hasContact = false;

    this.cbContactPairResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){

      let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );

      const distance = contactPoint.getDistance();

      if( distance > 0 ) return;
      this.hasContact = true;

    }

  }
  checkContact(){
    if (this.bullets_.length>0) {
      this.cbContactPairResult.hasContact = false;

      this.physicsWorld_.contactPairTest(this.bullets_[0].mesh.userData.physicsBody,this.water.mesh_.userData.physicsBody, this.cbContactPairResult);
      if( this.cbContactPairResult.hasContact ){
        this.removeObjectById(this.bullets_[0].mesh.id);
        this.bullets_.pop();
        this.decreaseScore();
        this.isInShoot=false;
        return;
      }
      for (let i = 0; i < this.targets.length; ++i) {
        this.physicsWorld_.contactPairTest(this.bullets_[0].mesh.userData.physicsBody,this.targets[i].userData.physicsBody, this.cbContactPairResult);
        if( this.cbContactPairResult.hasContact ){
          this.removeObjectById(this.bullets_[0].mesh.id);
          this.bullets_.pop();
          this.removeObjectById(this.targets[i].scene.id)
          this.targets.splice(i,1);
          this.increaseScore();
          this.isInShoot=false;
          return;
        }
      }
      // console.log(temp);
    }
  }
  removeObjectById(id){
    let selectedObject = this.scene_.getObjectById(id);
    this.scene_.remove(selectedObject);
  }
  increaseScore(){
    this.score++;
    document.getElementById('score-text').innerText = this.score.toLocaleString(
        'en-US', {minimumIntegerDigits: 5, useGrouping: false});
    if (this.score>this.winScore){
      this.gameOver_ = true;
      document.getElementById('game-win').classList.toggle('active');
    }
  }
  decreaseScore(){
    this.score--;
    document.getElementById('score-text').innerText = this.score.toLocaleString(
        'en-US', {minimumIntegerDigits: 5, useGrouping: false});
    if (this.score<this.loseScore){
      this.gameOver_ = true;
      document.getElementById('game-over').classList.toggle('active');
    }
  }
  updatePhysics(timeElapsed){
    this.physicsWorld_.stepSimulation(timeElapsed, 10);

    for (let i = 0; i < this.bullets_.length; ++i) {
      this.bullets_[i].rigidBody.motionState_.getWorldTransform(this.tmpTransform_);
      const pos = this.tmpTransform_.getOrigin();
      const quat = this.tmpTransform_.getRotation();
      const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
      const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

      this.bullets_[i].mesh.position.copy(pos3);
      this.bullets_[i].mesh.quaternion.copy(quat3);
    }
    this.checkContact();
  }

  initControls(){
    this._controls = new OrbitControls(
        this.camera_, document.getElementById('container'));
    this._controls.target.set(0, 0, 0);

    this._controls.minPolarAngle = (90 - 30) * Math.PI / 180;
    this._controls.maxPolarAngle = (90-2) * Math.PI / 180;
    this._controls.minAzimuthAngle = 0
    this._controls.maxAzimuthAngle = Math.PI / 3

    this._controls.enableZoom=false;
    this._controls.enablePan=false;
    this._controls.maxDistance=5000;

    this._controls.update();
  }
  OnKeyDown(event){
    switch (event.code) {
      case "Space":
        this.gameObjects.forEach((s)=>{
          if (this.bullets_.length===0) {
            s.Shoot(this.physicsWorld_, this.bullets_, this.camera_);
            this.isInShoot=true;
            console.log("shoot")
          }
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
    if (this.isInShoot){
      let vec=this.bullets_[0].mesh.position;
      console.log(vec);
      this._controls.enabled=false;
      this.camera_.lookAt(vec.x,vec.y,vec.z);
      this._controls.target.set(vec.x,vec.y,vec.z);
      this.camera_.position.set(vec.x+this.cameraPos.x,vec.y+this.cameraPos.y,vec.z+this.cameraPos.z);
      this.isReturnCameraOnPlace=true;
    }else{
      this._controls.enabled=true;
      if (this.isReturnCameraOnPlace){
         this.camera_.position.set( this.cameraPos.x,this.cameraPos.y,this.cameraPos.z);
        this.isReturnCameraOnPlace=false;
      }
      this._controls.target.set(0, 0, 0);
      this.camera_.lookAt(0, 0, 0);
    }
    this.gameObjects.forEach((gameObj)=>gameObj.update(timeElapsed));
    this.ground.Update(timeElapsed);
    this._controls.update();
    this.water.Update(timeElapsed);
    this.block.Update(timeElapsed)
    this.updatePhysics(timeElapsed);



    // if (this.player_.gameOver && !this.gameOver_) {
    //   this.gameOver_ = true;
    //   document.getElementById('game-over').classList.toggle('active');
    // }
  }

}


let _APP = null;

window.addEventListener('DOMContentLoaded', async () => {
  Ammo().then((lib=>{
      Ammo=lib;
    _APP = new BasicWorldDemo();
  }))

});


