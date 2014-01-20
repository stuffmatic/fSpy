


function UI() {
    
    //////////////////////////////////////////
    // Private vars
    //////////////////////////////////////////
    
    var ui = this;
    
    var colXAxis = "#aa2200";
    var colYAxis = "#22aa00";
    var colZAxis = "#2175aa";
    var colHorizon = "#aaaaaa";
    var colPP = "#ffaa00";
    var colOrigin = "#f0f0f0";
    var selectionRadius = 8;
    
    var controlPointList;
    
    var canvasContainer;
    var canvasImage;
    var canvasOverlay;
    var canvasRow;
    var errorModal;
    var errorMessageP;
    var infoP;
    var imageUrlTextField;
    var imageUrlTextField;
    
    var draggedControlPoint = null;

    this.recalculateResult = function() {
        
        //compute input parameters from ui state
        //TODO
        
        //compute calibraton result from input parameters
        //TODO
        
        //redraw
        this.redraw();
    }
    
    getCurrentImageRectSc = function()
    {
        var w = canvasRow.width();
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
    
        //position in image coordinates
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
    
        return [xIm, yIm];
    }
    
    drawLineSegment = function(ctx, start, end, col, endMarkers)
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
            drawControlPoint(ctx, start, col, true);
            drawControlPoint(ctx, end, col, true);
        }
    }
    
    /**
     * Draws a single line segment control point at a
     * given position, using a given context.
     */
    drawControlPoint = function(ctx, pos, col, fill)
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
    }
    
    
    this.redraw = function() {
        var cr = canvasRow;
        var cc = canvasContainer;
        var oc = canvasOverlay;
        var ic = canvasImage;
        
        var aspect = 9 / 16.0;
        
        //image
        if (this.image && this.image.naturalWidth > 0)
        {
            aspect = this.image.naturalHeight / this.image.naturalWidth;
        }

        var w = cr.width();
        var h = aspect * w;
        
        cc.width(w);
        cc.height(h);
        
        var ctx = ic[0].getContext('2d');
        
        ic.attr('width', w);
        ic.attr('height', h);
        if (this.image && this.state.drawImage) {
            
            var r = getCurrentImageRectSc();
            console.log(r);
            var ctx = ic[0].getContext('2d');
            ctx.drawImage(this.image, r[0], r[1], r[2], r[3]);
        }
        else {
            ctx.clearRect(0, 0, w, h);
        }
        
        
        
        //overlay
        var ctx = oc[0].getContext('2d');
        oc.attr('width', w);
        oc.attr('height', h);
        ctx.clearRect(0, 0, w, h);
        
        ctx.lineWidth = 1;
    
        //draw control points
        if (this.state.drawCP) {
        
            drawLineSegment(ctx, this.state.cpX0Start, this.state.cpX0End, colXAxis, true);
            drawLineSegment(ctx, this.state.cpX1Start, this.state.cpX1End, colXAxis, true);
            
            if (this.state.numVPs > 1) {
                drawLineSegment(ctx, this.state.cpY0Start, this.state.cpY0End, colYAxis, true);
                drawLineSegment(ctx, this.state.cpY1Start, this.state.cpY1End, colYAxis, true);
            }
        
            if (this.state.numVPs > 2) {
                drawLineSegment(ctx, this.state.cpZ0Start, this.state.cpZ0End, colZAxis, true);
                drawLineSegment(ctx, this.state.cpZ1Start, this.state.cpZ1End, colZAxis, true);
            }
    
            if (this.state.numVPs == 1) {
                var start = this.state.manualHorizon ? this.state.cpHorizonStart : [0.1, 0.5];
                var end = this.state.manualHorizon ? this.state.cpHorizonEnd : [0.9, 0.5];
                drawLineSegment(ctx, 
                    start, 
                    end, 
                    colHorizon, 
                    this.state.manualHorizon);
                }
        
                drawControlPoint(ctx, this.state.cpOrigin, colOrigin, true);
                drawControlPoint(ctx, this.state.cpPP, colPP, this.state.numVPs < 3);
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
    
    
    this.onNumVanishingPointsChanged = function() {
    
         var val = $("input[name='radio_num_vps']:checked").val();
         this.state.numVPs = val;
     
     
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
         
         this.redraw();
    }
    
    this.setImageVisible = function(on) {
        this.state.drawImage = on;
        this.redraw();
    }
    
    this.setControlPointsVisible = function(on) {
        this.state.drawCP = on;
        this.redraw();
    }
    
    this.setGridVisible = function(on) {
        this.state.drawGrid = on;
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
    
    this.setInfoLabelText = function(message) {
        infoP.text(message);
    }
    
    this.showErrorMessage = function(message) {
        errorMessageP.text(message);
        errorModal.foundation('reveal', 'open');
    }
    
    onMouseMoveOnCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        
        if (draggedControlPoint != null) {
            console.log("dragging pt");
            var pRel = canvasToRelImage(x, y);
            
            draggedControlPoint[0] = pRel[0];
            draggedControlPoint[1] = pRel[1];
            
            ui.recalculateResult();
        }
        
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
        //console.log("onMouseEnterCanvas: " + x + ", " + y);
    }
    
    onMouseLeaveCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        
        draggedControlPoint = null;
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
    }
    
    onDropOnCanvas = function(event) {
        event.stopPropagation();
        event.preventDefault();

        var files = event.dataTransfer.files; // FileList object.
        console.log(files);
        if (files.length != 1)
        {
            ui.showErrorMessage('Try dropping a single image.');
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
        errorModal = $("#modal_error_message");
        errorMessageP = $("#p_error_message"); 
        infoP = $("#info_label");       
        imageUrlTextField = $("#textfield_image_url");
        imageUrlTextField.val("img/cube.png");
        
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
                ui.onNumVanishingPointsChanged();
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
        
        $("#button_on_center_pp").click(function(){
            ui.onCenterPrincipalPoint();
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
        
        //initialize UI state
        this.setInfoLabelText("");
        
        //TODO: load data from url or cookie
        this.state = {}
        var sessionData = {
            
            uiState:
            {
                customSensorWidth: 36,
                customSensorHeight: 24,
        
                cpX0Start: [0.2, 0.2],
                cpX0End: [0.8, 0.2],
                cpX1Start: [0.8, 0.2],
                cpX1End: [0.8, 0.8],
        
                cpY0Start: [0.3, 0.3],
                cpY0End: [0.7, 0.3],
                cpY1Start: [0.7, 0.3],
                cpY1End: [0.7, 0.7],
        
                cpZ0Start: [0.4, 0.4],
                cpZ0End: [0.4, 0.6],
                cpZ1Start: [0.6, 0.4],
                cpZ1End: [0.6, 0.6],
        
                cpHorizonStart: [0.1, 0.5],
                cpHorizonEnd: [0.9, 0.5],
        
                cpOrigin: [0.5, 0.5],
                cpPP: [0.1, 0.1],
                
                numVPs: 2,
                manualHorizon: true,
                
                drawImage: true,
                drawCP: true,
                drawGrid: true,
                
                
            } 
        }
        
        this.loadSession(sessionData);
        
        this.onNumVanishingPointsChanged();
        this.recalculateResult();
        this.redraw();
        this.onLoadImageUrl();
    }
    
}

window.blam = window.blam || {}
blam.ui = blam.ui || new UI();
