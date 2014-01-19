window.blam = window.blam || {}
blam.ui = blam.ui || {}

blam.ui = (function() {

    this.calibrationResult = window.blam.calibrationResult;
    this.inputParams = window.blam.inputParams;
    
    
    
    this.redraw = function() {
        var cr = this.canvasRow;
        var cc = this.canvasContainer;
        var oc = this.canvasOverlay;
        var ic = this.canvasImage;
        
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
    
    this.onCenterPrincipalPoint = function() {
        
    }
    
    this.showErrorMessage = function(message) {
        this.errorMessageP.text(message);
        this.errorModal.foundation('reveal', 'open');
    }
    
    this.init = function() {
        
        //////////////////////////////////
        //   cache elements
        //////////////////////////////////
        this.canvasContainer = $("#canvas_container");
        this.canvasImage = $("#canvas_image");
        this.canvasOverlay = $("#canvas_overlay");
        this.canvasRow = $("#canvas_row");
        this.errorModal = $("#modal_error_message");
        this.errorMessageP = $("#p_error_message");        
        this.imageUrlTextField = $("#textfield_image_url");
        this.imageUrlTextField.val("img/cube.png");
        
        //////////////////////////////////
        //   Variables
        //////////////////////////////////
        this.image = null;
        
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
        
        this.redraw();
        
        this.onLoadImageUrl();
        
        
    };
    
    return this;
    
}());