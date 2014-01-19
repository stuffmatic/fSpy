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
        
        //image
        
        //overlay
        var aspect = 9 / 16.0;
        
        var w = cr.width();
        var h = aspect * w;//cc.height();
        
        cc.width(w);
        cc.height(h);
        
        var ctx = oc[0].getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
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
    
    this.init = function() {
        
        //cache elements
        this.canvasContainer = $("#canvas_container");
        this.canvasImage = $("#canvas_image");
        this.canvasOverlay = $("#canvas_overlay");
        this.canvasRow = $("#canvas_row");
        
        //hook up event callbacks
        var ui = this;
        
        $("input[name='radio_num_vps']").change(
            function(){
                ui.onNumVanishingPointsChanged();
            }
        );
        
        $(window).resize(function(){
            ui.redraw();
        });
        
        
        
        this.redraw();
    };
    
    return this;
    
}());