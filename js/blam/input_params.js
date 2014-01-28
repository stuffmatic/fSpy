window.blam = window.blam || {}
window.blam.inputParams = window.blam.inputParams || {}

window.blam.inputParams = (function() {
    
    /** 
     * The X axis vanishing point in normalized
     * image coordinates.
     */
    this.numVanishingPoints;
    this.xVanishingLine0;
    this.xVanishingLine1;
    this.yVanishingLine0;
    this.yVanishingLine1;
    this.zVanishingLine0;
    this.zVanishingLine1;
    this.opticalCenter;
    this.origin;
    this.horizonDirection;
    this.relativeFocalLength;
    
    reset = function() {
        this.numVanishingPoints = 0;
        this.xVanishingLine0 = [0, 0];
        this.xVanishingLine1 = [0, 0];
        this.yVanishingLine0 = [0, 0];
        this.yVanishingLine1 = [0, 0];
        this.zVanishingLine0 = [0, 0];
        this.zVanishingLine1 = [0, 0];
        this.opticalCenter = [0, 0];
        this.origin = [0, 0];
        this.horizonDirection = [0, 0];
        this.relativeFocalLength = 1;
    }
    
    /**
     * Converts a UI state to a set of input parameters
     * to the camera calibration algorithm.
     */
    this.fromUIState = function(uiState, aspectRatio) {
        reset();
        
        //horizon line
        this.horizonDirection = [1, 0];
        if (uiState.manualHorizon) {
            this.horizonDirection = [uiState.cpHorizonEnd[0] - uiState.cpHorizonStart[0], 
                                     (uiState.cpHorizonEnd[1] - uiState.cpHorizonStart[1])];
        }
        this.horizonDirection = blam.math.relIm2ImPlane(this.horizonDirection, aspectRatio);
        
        //TODO
        this.relativeFocalLength = 2.2;
        
        //the number of given vanishing points
        this.numVanishingPoints = uiState.numVPs;
        
        //the optical center in image plane coordinates
        this.opticalCenter = blam.math.relIm2ImPlane(uiState.cpPP, aspectRatio);
        
        //3D origin in image plane coordinates
        this.origin = blam.math.relIm2ImPlane(uiState.cpOrigin, aspectRatio);
        
        //vanishing lines in image plane coodinates
        this.xVanishingLine0 = [blam.math.relIm2ImPlane(uiState.cpX0Start, aspectRatio), blam.math.relIm2ImPlane(uiState.cpX0End, aspectRatio)];
        this.xVanishingLine1 = [blam.math.relIm2ImPlane(uiState.cpX1Start, aspectRatio), blam.math.relIm2ImPlane(uiState.cpX1End, aspectRatio)];
                
        this.yVanishingLine0 = [blam.math.relIm2ImPlane(uiState.cpY0Start, aspectRatio), blam.math.relIm2ImPlane(uiState.cpY0End, aspectRatio)];
        this.yVanishingLine1 = [blam.math.relIm2ImPlane(uiState.cpY1Start, aspectRatio), blam.math.relIm2ImPlane(uiState.cpY1End, aspectRatio)];
        
        this.zVanishingLine0 = [blam.math.relIm2ImPlane(uiState.cpZ0Start, aspectRatio), blam.math.relIm2ImPlane(uiState.cpZ0End, aspectRatio)];
        this.zVanishingLine1 = [blam.math.relIm2ImPlane(uiState.cpZ1Start, aspectRatio), blam.math.relIm2ImPlane(uiState.cpZ1End, aspectRatio)];        
    }
    
    return this;
}());