window.blam = window.blam || {}
window.blam.calibrationResult = window.blam.calibrationResult || {}

window.blam.calibrationResult = (function() {
    
    this.resultIsDefined;
    /** Set if the result is not defined. */
    this.errorMessage;
    /** The focal length in image plane coordinates.*/
    this.focalLengthImagePlaneCoords;
    /** The two vanishing points used to compute the result. */
    this.vanishingPoints;
    /** The camera orientation as a 3x3 matrix. */
    this.orientationMatrix;
    /** The camera orientation as a unit quaternion. */
    this.orientationQuaternion;
    /** The camera orientation on axis angle form. */
    this.orientationAxisAngle;
    /** The camera 3D translation.*/
    this.translation;
    /** */
    this.modelViewMatrix;
    /** */
    this.projectionMatrix;
    /** */
    this.principalPoint;
    /** */
    this.aspectRatio;
    
    reset = function() {
        this.resultIsDefined = false;
        this.errorMessage = null;
        this.focalLengthImagePlaneCoords = 0;
        this.vanishingPoints = [];
        this.orientationMatrix = window.blam.math.identityMatrix(3);
        console.log(this.orientationMatrix);
        this.orientationQuaternion = window.blam.math.zeroVector(4);
        this.orientationAxisAngle = window.blam.math.zeroVector(4);
        this.translation = window.blam.math.zeroVector(3);
        this.modelViewMatrix = window.blam.math.identityMatrix(4);
        this.projectionMatrix = window.blam.math.identityMatrix(4);
        this.principalPoint = window.blam.math.zeroVector(2);
        this.aspectRatio = 1.0;
    }
    
    this.compute = function(params) {
        reset();
    }
    
    return this;
}());