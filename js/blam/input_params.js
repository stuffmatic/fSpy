window.blam = window.blam || {}
window.blam.inputParams = window.blam.inputParams || {}

window.blam.inputParams = (function() {
    
    this.vanishingPoint1;
    this.vanishingPoint2;
    this.vanishingPoint3;
    this.aspectRatio;
    this.opticalCenter;
    this.origin;
    this.focalLength;
    this.horizonDirection;
    
    reset = function() {
        this.vanishingPoint1 = [0, 0];
        this.vanishingPoint2 = [0, 0];
        this.vanishingPoint3 = [0, 0];
        this.aspectRatio = 0.0;
        this.opticalCenter = [0, 0];
        this.origin = [0, 0];
        this.focalLength = 0.0;
        this.horizonDirection = [0, 0];
    }
    
    this.fromUIState = function(uiState) {
        
        reset();
    }
    
    return this;
}());