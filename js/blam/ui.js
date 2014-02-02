


function UI() {
    
    //////////////////////////////////////////
    // Private vars
    //////////////////////////////////////////
    
    //reference to 'this' to be used from within jquery callbacks
    var ui = this;
    
    var colXAxis = "#BD3213";
    var colYAxis = "#4D9632";
    var colZAxis = "#2175aa";
    var colHorizon = "#8C568B";
    var colPP = "#E07C09";
    var colOrigin = "#736F6B";
    var selectionRadius = 8;
    
    var controlPointList;
    
    var canvasContainer;
    var canvasImage;
    var canvasOverlay;
    var canvasRow;
    var canvasBorder;
    var errorModal;
    var errorMessageP;
    var infoLabelCP;
    var infoLabelError;
    var infoLabelPos;
    var infoLabelCalibrationResult;
    var imageUrlTextField;
    var sensorWidthTextField;
    
    var resultCamOrientationAAP;
    var resultCamOrientationQuatP;
    var resultCamOrientationMatrixP;
    var resultProjectionMatrixP;
    var resultCameraMatrixP;
    var resultFovP;
    
    var draggedControlPoint = null;

    this.recalculateResultAndRedraw = function() {
        
        if (typeof window.blam === 'undefined') {
            alert("blam undef");
        }
        if (typeof window.blam.inputParams === 'undefined') {
            alert("blam inputParams undef");
        }
        if (typeof window.blam.calibrationResult === 'undefined') {
            alert("blam result undef");
        }
        
        
        //console.log(window.blam.inputParams);
        
        //compute input parameters from ui state
        var aspectRatio = canvasContainer.width() / canvasContainer.height();
        
        window.blam.inputParams.fromUIState(ui.state, aspectRatio);
        
        //compute calibraton result from input parameters
        var res = window.blam.calibrationResult;
        res.compute(window.blam.inputParams);
        
        //update result fields
        setResultMatrix(resultCameraMatrixP, res.orientationMatrix, 3); //TODO: actual compound transform
        setResultMatrix(resultProjectionMatrixP, res.projectionMatrix, 4);
        setResultMatrix(resultCamOrientationMatrixP, res.orientationMatrix, 3);
        
        var sensorWidth = sensorWidthTextField.val();
        var absFocalLength = Number(sensorWidth * res.focalLengthImagePlaneCoords / 2.0).toFixed(2);
        setCalibrationResultInfoLabelText(absFocalLength + " mm");
        
        var fovText = "Focal length   : " + absFocalLength + " mm\n";
        fovText +=    "FOV horizontal : " + res.fovHorizDeg + " degrees\n";
        fovText +=    "FOV vertical   : " + res.fovHorizDeg + " degrees\n";
        
        if (window.blam.inputParams.numVanishingPoints == 3) {
            fovText +=    "Optical center : (" + res.principalPoint[0] + "," + res.principalPoint[1] + ") pixels\n";
        } 
        else {
            fovText += "\n"
        }
        resultFovP.text(fovText);
        
        
        //redraw canvas
        this.redraw();
    }
    
    setResultMatrix = function(element, matrix, nCols) {
        element.text("");
        var text = "";
        var n = 5;
        var l = matrix.length;
        for (var i = 0; i < l; i++)
        {
            if (i > 0 && (i % nCols) == 0) {
                text += "\n";
            }
            var pref = matrix[i] < 0 ? "" : " ";
            text += pref + matrix[i].toFixed(n) + " ";
            
        }
        
        element.text(text);
    }
    
    getCurrentImageRectSc = function()
    {
        var w = canvasContainer.width();
        var h = canvasContainer.height();

        var wIm = this.image != null ? this.image.naturalWidth : w;
        var hIm = this.image != null ? this.image.naturalHeight : h;
    
        var wScale = w / wIm;
        var hScale = h / hIm;
    
        var scale = hScale > wScale ? wScale : hScale;
        var wR = scale * wIm;
        var hR = scale * hIm;
        var dx = 0.5 * (w - wR);
        var dy = 0.5 * (h - hR);
    
        return [dx, dy, wR, hR];
    }
    
    canvasToRelImage = function(x, y)
    {
        var rect = getCurrentImageRectSc();
    
        //position in relative image coordinates.
        var xIm = x - rect[0];
        var yIm = y - rect[1];
    
        var xImRel = Math.min(1.0, Math.max(0.0, xIm / rect[2]));
        var yImRel = Math.min(1.0, Math.max(0.0, (rect[3] - yIm) / rect[3]));
    
        return [xImRel, yImRel];
    }

    relImageToCanvas = function(x, y)
    {
        var rect = getCurrentImageRectSc();
        //console.log("x, y " + x + ", " + y);
        var xIm = rect[0] + x * rect[2];
        var yIm = rect[1] + (1 - y) * rect[3];
    
        return [Math.round(xIm), Math.round(yIm)];
    }
    
    drawLineSegment = function(ctx, start, end, col, endMarkers, cpLabel)
    {
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        
        var p0 = relImageToCanvas(start[0], start[1]);
        var p1 = relImageToCanvas(end[0], end[1]);
    
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
    
        if (endMarkers)
        {
            drawControlPoint(ctx, start, col, true, cpLabel);
            drawControlPoint(ctx, end, col, true, cpLabel);
        }
    }
    
    /**
     * Draws a single line segment control point at a
     * given position, using a given context.
     */
    drawControlPoint = function(ctx, pos, col, fill, cpLabel)
    {
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        
        var p0 = relImageToCanvas(pos[0], pos[1]);
        ctx.beginPath();
        ctx.arc(p0[0], p0[1], selectionRadius, 0 , 2 * Math.PI, false);

        if (fill)
        {
            ctx.fill();
        }
        else
        {
            ctx.stroke();
        }
    
        ctx.closePath();     
        
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = "#f0f0f0";
        ctx.fillText(cpLabel, p0[0], p0[1]);
    }
    
    this.redraw = function() {
        var cr = canvasRow;
        var cc = canvasContainer;
        var oc = canvasOverlay;
        var ic = canvasImage;
        var cb = canvasBorder;
        
        var aspect = 16.0 / 9.0;
        
        //image
        if (this.image && this.image.naturalWidth > 0)
        {
            aspect = this.image.naturalWidth / this.image.naturalHeight;
        }

        var w = cb.width();
        var h = Math.round(w / aspect);
        
        cc.width(w);
        cc.height(h);
        
        var ctx = ic[0].getContext('2d');
        
        ic.attr('width', w);
        ic.attr('height', h);
        if (this.image && this.state.drawImage) {
            var r = getCurrentImageRectSc();
            console.log(r);
            var ctx = ic[0].getContext('2d');
            ctx.globalAlpha = this.state.lowImageContrast ? 0.2 : 1.0;
            ctx.drawImage(this.image, r[0], r[1], r[2], r[3]);
            ctx.globalAlpha = 1.0;
        }
        else {
            ctx.clearRect(0, 0, w, h);
        }
        
        //overlay
        var ctx = oc[0].getContext('2d');
        oc.attr('width', w);
        oc.attr('height', h);
        ctx.clearRect(0, 0, w, h);
        
        ctx.lineWidth = 0.5;
        
        //draw vanishing lines
        if (this.calibrationResult.isDefined && this.state.drawGrid) {
            var cr = this.calibrationResult;
            var o = blam.math.imPlane2RelIm(this.inputParams.origin, aspect);
            var xVp = blam.math.imPlane2RelIm(cr.xVanishingPoint, aspect);
            var yVp = blam.math.imPlane2RelIm(cr.yVanishingPoint, aspect);
            var zVp = blam.math.imPlane2RelIm(cr.zVanishingPoint, aspect);
            drawLineSegment(ctx, o, xVp, colXAxis, false);
            drawLineSegment(ctx, o, yVp, colYAxis, false);
            drawLineSegment(ctx, o, zVp, colZAxis, false);
            
            if (this.state.numVPs == 3) {
                //use the computed optical center for 3 VPs
                var oc = blam.math.imPlane2RelIm(cr.opticalCenter, aspect);
                drawControlPoint(ctx, oc, colPP, false);
            }
        } 
        else {
            //undefined.
        }
    
        ctx.lineWidth = 1.0;
    
        //draw control points
        if (this.state.drawCP) {
        
            drawLineSegment(ctx, this.state.cpX0Start, this.state.cpX0End, colXAxis, true, "1");
            drawLineSegment(ctx, this.state.cpX1Start, this.state.cpX1End, colXAxis, true, "1");
            
            if (this.state.numVPs > 1) {
                drawLineSegment(ctx, this.state.cpY0Start, this.state.cpY0End, colYAxis, true, "2");
                drawLineSegment(ctx, this.state.cpY1Start, this.state.cpY1End, colYAxis, true, "2");
            }
        
            if (this.state.numVPs > 2) {
                drawLineSegment(ctx, this.state.cpZ0Start, this.state.cpZ0End, colZAxis, true, "3");
                drawLineSegment(ctx, this.state.cpZ1Start, this.state.cpZ1End, colZAxis, true, "3");
            }
    
            if (this.state.numVPs == 1) {
                var start = this.state.manualHorizon ? this.state.cpHorizonStart : [0.1, 0.5];
                var end = this.state.manualHorizon ? this.state.cpHorizonEnd : [0.9, 0.5];
                drawLineSegment(ctx, 
                    start, 
                    end, 
                    colHorizon, 
                    this.state.manualHorizon, "H");
            }
        
            drawControlPoint(ctx, this.state.cpOrigin, colOrigin, true, "O");
            
            if (this.state.numVPs < 3) {
                //use the computed optical center for 3 VPs
                drawControlPoint(ctx, this.state.cpPP, colPP, true, "P");
            }
        }
        
        
    };
    
    getControlPointAtScreenCoord = function(xScreen, yScreen) {
        for (var i = 0; i < controlPointList.length; i++) {
            var pSc = relImageToCanvas(controlPointList[i][0], controlPointList[i][1]);
            
            var dx = xScreen - pSc[0];
            var dy = yScreen - pSc[1];
            var distSq = dx * dx + dy * dy;
            var rSq = selectionRadius * selectionRadius;
            
            if (distSq < rSq) {
                
                var hit = controlPointList[i];
                
                //a control point was hit. see if it's active
                
                var isYAxis = (hit == ui.state.cpY0Start || hit == ui.state.cpY0End ||
                               hit == ui.state.cpY1Start || hit == ui.state.cpY1End);
                               
                var isZAxis = (hit == ui.state.cpZ0Start || hit == ui.state.cpZ0End ||
                               hit == ui.state.cpZ1Start || hit == ui.state.cpZ1End);
                               
                var isHorizon = (hit == ui.state.cpHorizonStart || hit == ui.state.cpHorizonEnd);
                
                var isPP = hit == ui.state.cpPP;
                
                if (ui.state.numVPs == 1) {
                    if (isYAxis || isZAxis) {
                        continue;
                    }
                    else if (!ui.state.manualHorizon && isHorizon) {
                        continue
                    }
                }
                else if (ui.state.numVPs == 2) {
                    if (isHorizon || isZAxis) {
                        continue;
                    }                    
                }
                else if (ui.state.numVPs == 3) {
                    if (isHorizon || isPP) {
                        continue;
                    }
                }

                
                return hit;
            }
            
        }
    }
    
    this.onNumVPsRadioChanged = function() {
        var val = $("input[name='radio_num_vps']:checked").val();
        ui.state.numVPs = val;
        this.onNumVanishingPointsChanged();
    }
    
    this.onNumVanishingPointsChanged = function() {
    
        var val = ui.state.numVPs;
    
         var show1Vp = val == 1;
         var show2Vp = val == 2;
     
         $(".1vp").each(function() {
             if (show1Vp) {
                 $(this).show();
             }
             else {
                 $(this).hide();
             }
         });
     
         $(".2vp").each(function() {
             if (show2Vp) {
                 $(this).show();
             }
             else {
                 $(this).hide();
             }
         });
         
         this.recalculateResultAndRedraw();
    }
    
    this.toggleImageVisible = function(on) {
        this.state.drawImage = !this.state.drawImage;
        $("#button_toggle_image_visibility").css("opacity", this.state.drawImage ? "1.0" : "0.5");
        this.redraw();
    }
    
    this.toggleControlPointsVisible = function(on) {
        this.state.drawCP = !this.state.drawCP;
        $("#button_toggle_cp_visibility").css("opacity", this.state.drawCP ? "1.0" : "0.5");
        this.redraw();
    }
    
    this.toggleGridVisible = function(on) {
        this.state.drawGrid = !this.state.drawGrid;
        $("#button_toggle_grid_visibility").css("opacity", this.state.drawGrid ? "1.0" : "0.5");
        this.redraw();
    }
    
    this.toggleLowImageContrast = function(on) {
        this.state.lowImageContrast = !this.state.lowImageContrast;
        $("#button_toggle_image_contrast").css("opacity", this.state.lowImageContrast ? "0.5" : "1.0");
        this.redraw();
    }
    
    this.setManualHorizon = function(on) {
        this.state.manualHorizon = on;
        this.redraw();
    }
    
    this.onLoadImageUrl = function() {
        //TODO: progress
        var newImage = new Image();
        var url = imageUrlTextField.val();
        newImage.src = url;

        var ui = this;
    
        newImage.onerror = function()
        {
            ui.showErrorMessage("Could not load image from '" + url + "'.");
            newImage = null;
        };
    
        newImage.onload = function()
        {
            ui.image = null;
            ui.image = newImage;
            //recomputeCameraParameters();
            ui.redraw();
        };
    }
    
    this.onSaveSession = function() {
        
    }
    
    this.onLoadSession = function() {
        
    }
    
    this.onResetSession = function() {
        
    }
    
    this.loadSession = function(data) {
        this.state = data["uiState"];
        
        imageUrlTextField.val(this.state.imageUrl);
        
        this.onLoadImageUrl();
        
        controlPointList = [
        this.state.cpX0Start,
        this.state.cpX0End,
        this.state.cpX1Start,
        this.state.cpX1End,
        
        this.state.cpY0Start,
        this.state.cpY0End,
        this.state.cpY1Start,
        this.state.cpY1End,
        
        this.state.cpZ0Start,
        this.state.cpZ0End,
        this.state.cpZ1Start,
        this.state.cpZ1End,
        
        this.state.cpX0Start,
        this.state.cpX0End,
        this.state.cpX1Start,
        this.state.cpX1End,
        
        this.state.cpHorizonStart,
        this.state.cpHorizonEnd,
        
        this.state.cpOrigin,
        this.state.cpPP
        ];
        
        
    }
    
    this.onCenterPrincipalPoint = function() {
        this.state.cpPP = [0.5, 0.5];
        this.redraw();
    }
    
    setErrorInfoLabelText = function(message) {
        infoLabelError.text(message);
    }
    
    setPosInfoLabelText = function(message) {
        infoLabelPos.text(message);
    }
    
    setCPInfoLabelText = function(message, color) {
        infoLabelCP.text(message);
        infoLabelCP.css("color", color ? color : "");
    }
    
    setCalibrationResultInfoLabelText = function(message) {
        infoLabelCalibrationResult.text(message);
    }
    
    this.showErrorMessage = function(message) {
        errorMessageP.text(message);
        errorModal.foundation('reveal', 'open');
    }
    
    setInfoTextForControlPoint = function(point) {
        if (!point)
        {
            setCPInfoLabelText("");
        }
        else
        {
            var isXAxis = point == ui.state.cpX0Start;
            isXAxis = isXAxis || point == ui.state.cpX0End;
            isXAxis = isXAxis || point == ui.state.cpX1Start;
            isXAxis = isXAxis || point == ui.state.cpX1End;
            
            var isYAxis = point == ui.state.cpY0Start;
            isYAxis = isYAxis || point == ui.state.cpY0End;
            isYAxis = isYAxis || point == ui.state.cpY1Start;
            isYAxis = isYAxis || point == ui.state.cpY1End;
            
            var isZAxis = point == ui.state.cpZ0Start;
            isZAxis = isZAxis || point == ui.state.cpZ0End;
            isZAxis = isZAxis || point == ui.state.cpZ1Start;
            isZAxis = isZAxis || point == ui.state.cpZ1End;
            
            var isHorizon = point == ui.state.cpHorizonStart;
            isHorizon = isHorizon || point == ui.state.cpHorizonEnd;
            
            var is3DOrigin = point == ui.state.cpOrigin;
            
            var isPP = point == ui.state.cpPP;
            
            var message = "";
            var col = null;
            if (isXAxis) {
                message = "X axis vanishing line";
                col = colXAxis;
            }
            else if (isYAxis) {
                message = "Y axis vanishing line";
                col = colYAxis;
            }
            else if (isZAxis) {
                message = "Z axis vanishing line";
                col = colZAxis;
            }
            else if (isHorizon) {
                message = "Horizon line";
                col = colHorizon;
            }
            else if (is3DOrigin) {
                message = "3D origin";
                col = colOrigin;
            }
            else if (isPP) {
                message = "Optical center";
                col = colPP;
            }
            
            setCPInfoLabelText(message, col);
        }
    }
    
    onMouseMoveOnCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        
        if (draggedControlPoint != null) {
            console.log("dragging pt");
            var pRel = canvasToRelImage(x, y);
            
            draggedControlPoint[0] = pRel[0];
            draggedControlPoint[1] = pRel[1];
            
            ui.recalculateResultAndRedraw();
        }
        else {
            
            var cp = getControlPointAtScreenCoord(x, y);
            setInfoTextForControlPoint(cp);
            canvasOverlay.css("cursor", cp ? "pointer" : "crosshair");
        }
        
        setPosInfoLabelText(x + ", " + y);
        
        //console.log("onMouseMoveOnCanvas: " + x + ", " + y);
    }
    
    
    
    onMouseDownOnCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        draggedControlPoint = getControlPointAtScreenCoord(x, y);
        
        if (draggedControlPoint != null)
        {
            console.log("starting drag at " + x + ", " + y);
        }
        //console.log("onMouseDownOnCanvas: " + x + ", " + y);
    }
     
    onMouseEnterCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        
        setPosInfoLabelText(x + ", " + y);
        setErrorInfoLabelText("");
        canvasOverlay.css("cursor", "crosshair");
    
        //console.log("onMouseEnterCanvas: " + x + ", " + y);
    }
    
    onMouseLeaveCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        
        draggedControlPoint = null;
        
        setPosInfoLabelText("");
        setErrorInfoLabelText("");
        canvasOverlay.css("cursor", "default");
    
        //console.log("onMouseLeaveCanvas: " + x + ", " + y);
    }
    
    onMouseUpOnCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        
        draggedControlPoint = null;
        //console.log("onMouseUpOnCanvas: " + x + ", " + y);
    }
    
    onDragOverCanvas = function(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; 
        setErrorInfoLabelText("Drop image to load it");
    }
    
    onDropOnCanvas = function(event) {
        event.stopPropagation();
        event.preventDefault();

        var files = event.dataTransfer.files; // FileList object.
        console.log(files);
        if (files.length != 1)
        {
            ui.showErrorMessage('Try dropping a single file.');
            return;
        }


        // files is a FileList of File objects. List some properties.
        var file = files[0];

        if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) 
        {
            ui.image = null;
            ui.image = new Image();
            var reader = new FileReader();
            reader.onload = function (evt) 
            {
                console.log(evt.target.result);
                ui.image.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
        else
        {
            ui.showErrorMessage('Not a recognized image file.');
            return;
        }
        
        if (!ui.image)
        {
            ui.showErrorMessage('Something went wrong loading the image.');
            return;
        }

        setErrorInfoLabelText("");

        ui.image.onload = function()
        {
            ui.redraw();
        };
    }
    
    this.init = function() {
        
        //////////////////////////////////
        //   cache elements
        //////////////////////////////////
        canvasContainer = $("#canvas_container");
        canvasImage = $("#canvas_image");
        canvasOverlay = $("#canvas_overlay");
        canvasRow = $("#canvas_row");
        canvasBorder = $("#canvas_border");
        errorModal = $("#modal_error_message");
        errorMessageP = $("#p_error_message"); 
        infoLabelCP = $("#info_label_cp");       
        infoLabelPos = $("#info_label_pos");     
        infoLabelError = $("#info_label_error"); 
        infoLabelCalibrationResult = $("#info_label_calibration_result"); 
        imageUrlTextField = $("#textfield_image_url");
        sensorWidthTextField = $("#textfield_camera_sensor_width");
        
        resultCamOrientationAAP = $("#camera_orientation_axis_angle");
        resultCamOrientationQuatP = $("camera_orientation_axis_quat");
        resultCamOrientationMatrixP = $("#camera_orientation_matrix");
        resultProjectionMatrixP = $("#camera_projection_matrix");
        resultCameraMatrixP = $("#camera_matrix");
        resultFovP = $("#result_fov");
        
        //////////////////////////////////
        //   Variables
        //////////////////////////////////
        this.image = null;
        this.calibrationResult = window.blam.calibrationResult;
        this.inputParams = window.blam.inputParams;
        
        //////////////////////////////////
        //   hook up event callbacks
        //////////////////////////////////
        var ui = this;
        
        $("input[name='radio_num_vps']").change(
            function(){
                ui.onNumVPsRadioChanged();
            }
        );
        
        $(window).resize(function(){
            ui.redraw();
        });
        
        //checkboxes
        $("#checkbox_view_image").change(function(){
            var on = $(this).is(":checked");
            ui.setImageVisible(on);
        });
        
        $("#checkbox_view_cp").change(function(){
            var on = $(this).is(":checked");
            ui.setControlPointsVisible(on);
        });
        
        $("#checkbox_view_grid").change(function(){
            var on = $(this).is(":checked");
            ui.setGridVisible(on);
        });
        
        $("#checkbox_manual_horizon").change(function(){
            var on = $(this).is(":checked");
            ui.setManualHorizon(on);
        });
        
        //buttons
        $("#button_load_image_url").click(function(){
            ui.onLoadImageUrl();
            return false;
        });
        
        $("#button_session_save").click(function(){
            ui.onSaveSession();
            return false;
        });
        
        $("#button_session_load").click(function(){
            ui.onLoadSession();
            return false;
        });
        
        $("#button_session_reset").click(function(){
            ui.onResetSession();
            return false;
        });
        
        $("#button_center_pp").click(function(){
            ui.onCenterPrincipalPoint();
            return false;
        });
        
        //Visibility buttons
        $("#button_toggle_cp_visibility").click(function(){
            ui.toggleControlPointsVisible();
            return false;
        });
        
        $("#button_toggle_grid_visibility").click(function(){
            ui.toggleGridVisible();
            return false;
        });
        
        $("#button_toggle_image_visibility").click(function(){
            ui.toggleImageVisible();
            
            return false;
        });
        
        $("#button_toggle_image_contrast").click(function(){
            ui.toggleLowImageContrast();
            return false;
        });
        
        //canvas mouse events
        canvasOverlay.mousemove(onMouseMoveOnCanvas);
        canvasOverlay.mousedown(onMouseDownOnCanvas);
        canvasOverlay.mouseenter(onMouseEnterCanvas);
        canvasOverlay.mouseleave(onMouseLeaveCanvas);
        canvasOverlay.mouseup(onMouseUpOnCanvas);
        
        //canvas drag n drop events
        canvasOverlay[0].addEventListener('dragover', onDragOverCanvas, false);
        canvasOverlay[0].addEventListener('drop', onDropOnCanvas, false);        
    
        //keyboard shortcuts
        $(window).bind('keyup', function(e) {
            var code = e.keyCode || e.which;
            console.log(code);
            if (code == 49 || code == 50 | code == 51) { // 1-3
                ui.state.numVPs = 1 + code - 49;
                $("input[name='radio_num_vps']").filter('[value=' + ui.state.numVPs + ']').prop('checked', true);
                ui.onNumVanishingPointsChanged();
            }
            else if (code == 72) { //h
                ui.state.manualHorizon = !ui.state.manualHorizon;
                ui.recalculateResultAndRedraw();
            }
            else if (code == 73) { //i
                ui.toggleImageVisible();
            }
            else if (code == 67) { //c
                ui.toggleControlPointsVisible();
            }
            else if (code == 71) { //g
                ui.toggleGridVisible();
            }
            else if (code == 76) { //l
                ui.toggleLowImageContrast();
            }
            
        });
        
        //TODO: load data from url or cookie
        this.state = {}
        var sessionData = {
                  
            uiState:
            {
                /*
                customSensorWidth: 36,
                customSensorHeight: 24,
                
                cpX0Start: [0.7513812154696132,0.3736493123772102],
                cpX0End: [0.4276243093922652,0.029837917485265226],
                cpX1Start: [0.5646408839779006,0.8962426326129665],
                cpX1End: [0.16132596685082873,0.693885068762279],
        
                cpY0Start: [0.4839779005524862,0.5720776031434185],
                cpY0End: [0.2276243093922652,0.7724705304518664],
                cpY1Start: [0.4276243093922652,0.8824901768172888],
                cpY1End: [0.7756906077348066,0.6978143418467584],
        
                cpZ0Start: [0.29392265193370165,0.22826620825147348],
                cpZ0End: [0.2585635359116022,0.7901522593320236],
                cpZ1Start: [0.6674033149171271,0.21844302554027506],
                cpZ1End: [0.6906077348066298,0.7862229862475442],
        
                cpHorizonStart: [0.1, 0.5],
                cpHorizonEnd: [0.9, 0.5],
                
                lowImageContrast: false,
        
                cpOrigin: [0.46740331491712706,0.075024557956778],
                cpPP: [0.5, 0.5],
                
                numVPs: 2,
                manualHorizon: true,
                
                drawImage: true,
                drawCP: true,
                drawGrid: true,
                
                imageUrl: "img/cube.png"*/
                "customSensorWidth":36,"customSensorHeight":24,"cpX0Start":[0.906701030927835,0.7091346153846154],"cpX0End":[0.8438144329896907,0.5369734432234432],"cpX1Start":[0.547938144329897,0.604739010989011],"cpX1End":[0.43041237113402064,0.7805631868131868],"cpY0Start":[0.6582474226804124,0.4179258241758242],"cpY0End":[0.21082474226804124,0.7659111721611722],"cpY1Start":[0.606701030927835,0.8281822344322345],"cpY1End":[0.9345360824742268,0.6505265567765568],"cpZ0Start":[0.38608247422680414,0.029647435897435896],"cpZ0End":[0.34484536082474226,0.6853250915750916],"cpZ1Start":[0.6201030927835052,0.024152930402930404],"cpZ1End":[0.6108247422680413,0.560782967032967],"cpHorizonStart":[0.12010309278350516,0.49668040293040294],"cpHorizonEnd":[0.9850515463917526,0.3446657509157509],"lowImageContrast":true,"cpOrigin":[0.8015463917525774,0.6944826007326007],"cpPP":[0.6685567010309278,0.32818223443223443],"numVPs":1,"manualHorizon":true,"drawImage":true,"drawCP":true,"drawGrid":true,"imageUrl":"img/cube_35mm_pp_offs.png"
            } 
        }
        
        this.loadSession(sessionData);
        
        this.onNumVanishingPointsChanged();
        this.recalculateResultAndRedraw();
        
    }
    
}

window.blam = window.blam || {}
blam.ui = blam.ui || new UI();
