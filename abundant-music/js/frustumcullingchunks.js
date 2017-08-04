

function FrustumCullingChunks() {
    this.objects = [];
    this.boundingSpheres = [];
    this.maxDistance = 1000;

    this.objectsInScene = [];
    this.objectsNotInScene = [];

    this.planes = [
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4()
    ];
}

FrustumCullingChunks.prototype.addChunk = function(object, sphere) {
    this.objects.push(object);
    this.boundingSpheres.push(sphere);
    this.objectsInScene.push(this.objects.length - 1);
};

FrustumCullingChunks.prototype.updateScene = function(scene, m) {

    var plane;
    var planes = this.planes;

    var me = m.elements;
    var me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
    var me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
    var me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
    var me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

    planes[ 0 ].set( me3 - me0, me7 - me4, me11 - me8, me15 - me12 );
    planes[ 1 ].set( me3 + me0, me7 + me4, me11 + me8, me15 + me12 );
    planes[ 2 ].set( me3 + me1, me7 + me5, me11 + me9, me15 + me13 );
    planes[ 3 ].set( me3 - me1, me7 - me5, me11 - me9, me15 - me13 );
    planes[ 4 ].set( me3 - me2, me7 - me6, me11 - me10, me15 - me14 );
    planes[ 5 ].set( me3 + me2, me7 + me6, me11 + me10, me15 + me14 );

    for ( var i = 0; i < 6; i ++ ) {
        plane = planes[ i ];
        plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );
    }

    var sceneObjectsToRemove = [];
    var sceneObjectsToAdd = [];

    var newSceneObjects = [];
    var newNotInSceneObjects = [];
    for (var i=0; i<this.objectsInScene.length; i++) {
        var index = this.objectsInScene[i];
        var object = this.objects[index];
        var sphere = this.boundingSpheres[index];
        if (!this.contains(object, sphere)) {
            sceneObjectsToRemove.push(object);
            newNotInSceneObjects.push(index);
        } else {
            newSceneObjects.push(index);
        }
    }
    for (var i=0; i<this.objectsNotInScene.length; i++) {
        var index = this.objectsNotInScene[i];
        var object = this.objects[index];
        var sphere = this.boundingSpheres[index];
        if (this.contains(object, sphere)) {
            sceneObjectsToAdd.push(object);
            newSceneObjects.push(index);
        } else {
            newNotInSceneObjects.push(index);
        }
    }
    this.objectsNotInScene = newNotInSceneObjects;
    this.objectsInScene = newSceneObjects;

    for (var i=0; i<sceneObjectsToAdd.length; i++) {
        scene.add(sceneObjectsToAdd[i]);
//        logit("Adding chunk..." + i + " " + this.objectsInScene.length + " " + this.objectsNotInScene.length);
    }
    for (var i=0; i<sceneObjectsToRemove.length; i++) {
        scene.remove(sceneObjectsToRemove[i]);
//        logit("Removing chunk... " + i + " " + this.objectsInScene.length + " " + this.objectsNotInScene.length);
    }

};


FrustumCullingChunks.prototype.contains = function ( object, boundingSphere ) {
    var distance = 0.0;
    var planes = this.planes;
    var matrix = object.matrixWorld;
    var me = matrix.elements;
    var radius = - boundingSphere.radius * matrix.getMaxScaleOnAxis();

    for ( var i = 0; i < 6; i ++ ) {

        distance = planes[ i ].x * me[12] + planes[ i ].y * me[13] + planes[ i ].z * me[14] + planes[ i ].w;
        if ( distance <= radius ) return false;

    }
    return true;
};

