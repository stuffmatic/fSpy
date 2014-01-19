


function UI() {
    
    //////////////////////////////////////////
    // Private vars
    //////////////////////////////////////////
    
    var ui = this;
    var canvasContainer;
    var canvasImage;
    var canvasOverlay;
    var canvasRow;
    var errorModal;
    var errorMessageP;
    var infoP;
    var imageUrlTextField;
    var imageUrlTextField;

    this.recalculateResult = function() {
        
        //compute input parameters from ui state
        //TODO
        
        //compute calibraton result from input parameters
        //TODO
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
        
        //overlay
        var w = cr.width();
        var h = aspect * w;
        
        cc.width(w);
        cc.height(h);
        
        oc.attr('width', w);
        oc.attr('height', h);
        
        if (this.image)
        {
            ic.attr('width', w);
            ic.attr('height', h);
            var ctx = ic[0].getContext('2d');
            ctx.drawImage(this.image, 0, 0, w, h);
        }
        
        var ctx = oc[0].getContext('2d');
        ctx.clearRect(0, 0, w, h);
        
        ctx.lineWidth = 1;
    
        //draw vanishing lines and vanishing points
        var col = "#aa2200";
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, h);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(0, h);
        ctx.stroke();
        
    };
    
    this.onNumVanishingPointsChanged = function() {
    
         var val = $("input[name='radio_num_vps']:checked").val();
     
     
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
    }
    
    this.setImageVisible = function(on) {
        
    }
    
    this.setControlPointsVisible = function(on) {
        
    }
    
    this.setGridVisible = function(on) {
        
    }
    
    this.setManualHorizon = function(on) {
        
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
    }
    
    this.onCenterPrincipalPoint = function() {
        
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
        console.log("onMouseMoveOnCanvas: " + x + ", " + y);
    }
    
    onMouseDownOnCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        console.log("onMouseDownOnCanvas: " + x + ", " + y);
    }
     
    onMouseEnterCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        console.log("onMouseEnterCanvas: " + x + ", " + y);
    }
    
    onMouseLeaveCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        console.log("onMouseLeaveCanvas: " + x + ", " + y);
    }
    
    onMouseUpOnCanvas = function(event) {
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        console.log("onMouseUpOnCanvas: " + x + ", " + y);
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
        
            $('#imageURL').val("")
        }
        else
        {
            ui.showErrorMessage('Not a recognized image file.');
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
        
                cpOrigin: [0.5, 0.5]
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
