
export const rigidBody = (() => {

    class RigidBody {
    constructor() {
    }

    setRestitution(val) {
        this.body_.setRestitution(val);
    }

    setFriction(val) {
        this.body_.setFriction(val);
    }

    setRollingFriction(val) {
        this.body_.setRollingFriction(val);
    }
    setLineralVelocity(vector){
    //    console.log(vector);
        const tempVec=new Ammo.btVector3(parseInt(vector.x,10),parseInt(vector.y,10),parseInt(vector.z,10 ));

        //this.body_.setLinearVelocity( tempVec );
        this.body_.applyImpulse(tempVec);
    }
    createBox(mass, pos, quat, size) {
        this.transform_ = new Ammo.btTransform();
        this.transform_.setIdentity();
        this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        this.transform_.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        this.motionState_ = new Ammo.btDefaultMotionState(this.transform_);

        const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
        this.shape_ = new Ammo.btBoxShape(btSize);
        this.shape_.setMargin(0.05);

        this.inertia_ = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) {
            this.shape_.calculateLocalInertia(mass, this.inertia_);
        }

        this.info_ = new Ammo.btRigidBodyConstructionInfo(
            mass, this.motionState_, this.shape_, this.inertia_);
        this.body_ = new Ammo.btRigidBody(this.info_);

        Ammo.destroy(btSize);
    }
    createSphere(mass, pos, size) {
        this.transform_ = new Ammo.btTransform();
        this.transform_.setIdentity();
        this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        this.transform_.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        this.motionState_ = new Ammo.btDefaultMotionState(this.transform_);

        this.shape_ = new Ammo.btSphereShape(size);
        this.shape_.setMargin(0.05);

        this.inertia_ = new Ammo.btVector3(0, 0, 0);
        if(mass > 0) {
            this.shape_.calculateLocalInertia(mass, this.inertia_);
        }

        this.info_ = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState_, this.shape_, this.inertia_);
        this.body_ = new Ammo.btRigidBody(this.info_);
    }
    createByGeometry(mass,geometry,pos,scalingFactor) {
        this.transform_ = new Ammo.btTransform();
        this.transform_.setIdentity();
        this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        this.transform_.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
        this.motionState_ = new Ammo.btDefaultMotionState(this.transform_);
        this.mesh = new Ammo.btTriangleMesh(true, true);
       // console.log(geometry.attributes.position.array);
        this.vertexPositionArray = geometry.attributes.position.array;
        this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        for (var i = 0; i < geometry.attributes.position.count/3; i++) {
            this.mesh.addTriangle(
                new Ammo.btVector3(this.vertexPositionArray[i*9+0]*scalingFactor, this.vertexPositionArray[i*9+1]*scalingFactor, this.vertexPositionArray[i*9+2]*scalingFactor ),
                new Ammo.btVector3(this.vertexPositionArray[i*9+3]*scalingFactor, this.vertexPositionArray[i*9+4]*scalingFactor, this.vertexPositionArray[i*9+5]*scalingFactor),
                new Ammo.btVector3(this.vertexPositionArray[i*9+6]*scalingFactor, this.vertexPositionArray[i*9+7]*scalingFactor,this.vertexPositionArray[i*9+8]*scalingFactor),
                false
            );
        }
        this.inertia_ = new Ammo.btVector3(0, 0, 0);
        this.shape_ = new Ammo.btBvhTriangleMeshShape(this.mesh, true, true);
        if(mass > 0) {
            this.shape_.calculateLocalInertia(mass, this.inertia_);
        }

        this.info_ = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState_, this.shape_, this.inertia_);
        this.body_ = new Ammo.btRigidBody(this.info_);
    }
}    return {
        RigidBody: RigidBody

    };
})();
