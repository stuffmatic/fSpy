window.blam.cameraPresets =
{
    "custom": {
        name: "Custom camera",
        width: 36,
        height: 24
    },
    "blender": {
        name: "Blender default camera",
        width: 32,
        height: 24
    },
    "aps-c": {
        name: "APS-C DSLR",
        width: 22.3,
        height: 14.9
    },
    "canon_1d": {
        name: "Canon 1D",
        width: 27.9,
        height: 18.6
    },
    "canon_1ds": {
        name: "Canon 1DS",
        width: 36,
        height: 24
    },
    "canon_5d": {
        name: "Canon 5D",
        width: 36,
        height: 24
    },
    "canon_7d": {
        name: "Canon 7D",
        width: 22.3, 
        height: 14.9
    },
    "canon_60d": {
        name: "Canon 60D",
        width: 22.3,
        height: 14.9
    },
    "canon_500d": {
        name: "Canon 500D",
        width: 22.3,
        height: 14.9
    },
    "canon_550d": {
        name: "Canon 550D",
        width: 22.3,
        height: 14.9
    },
    "canon_600d": {
        name: "Canon 600D",
        width: 22.3,
        height: 14.9
    },
    "canon_1100d": {
        name: "Canon 1100D",
        width: 22.2, 
        height: 14.7
    },
    "35_mm_film": {
        name: "35 mm film",
        width: 36,
        height: 24
    },
    "micro_4_3rds": {
        name: "Micro four thirds",
        width: 17.3,
        height: 14
    },
    "nikon_d3s": {
        name: "Nikon D3S",
        width: 36,
        height: 23.9
    },
    "nikon_d90": {
        name: "Nikon D90",
        width: 23.6,
        height: 15.8
    },
    "nikon_d300s": {
        name: "Nikon D300S",
        width: 23.6,
        height: 15.8
    },
    "nikon_d3100": {
        name: "Nikon D3100",
        width: 23.1,
        height: 15.4
    },
    "nikon_d5000": {
        name: "Nikon D5000",
        width: 23.6,
        height: 15.8
    },
    "nikon_d5100": {
        name: "Nikon D5100",
        width: 23.6,
        height: 15.6
    },
    "nikon_d7000": {
        name: "Nikon D7000",
        width: 23.6,
        height: 15.6
    },
    "red_epic": {
        name: "Red Epic",
        width: 30,
        height: 15
    },
    "red_epic_2k": {
        name: "Red Epic 2k",
        width: 11.1,
        height: 6.24
    },
    "red_epic_3k": {
        name: "Red Epic 3k",
        width: 16.65,
        height: 9.36
    },
    "red_epic_4k": {
        name: "Red Epic 4k",
        width: 22.2,
        height: 12.6
    },
    "sony_a55": {
        name: "Sony A55",
        width: 23.4,
        height: 15.6
    },
    "super_16": {
        name: "Super 16 film",
        width: 12.52, 
        height: 7.41
    },
    "super_32": {
        name: "Super 35 film",
        width: 24.89,
        height: 18.66
    },
};

window.blam = window.blam || {}
window.blam.inputParams = window.blam.inputParams || {}

assert = function(condition) {
    if (!condition) {
        console.log("Assertion failed");
    }
} 


function checkBrowserCompatibility()
{
    var errorList = "";
    
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) 
    {
        //ok
    }
    else 
    {
        errorList += '<li>The File APIs are not fully supported in this browser.</li>';
    }
    
    // check if canvas is supported
    if (window.imageCanvas && window.imageCanvas.getContext &&
        window.overlayCanvas && window.overlayCanvas.getContext) 
    {
        //ok
    }
    else
    {
        errorList += '<li>Canvas not supported.</li>';
    }
    
    return null;
}

function setCameraPreset(key)
{
    console.log("setCameraPreset(key=" + key + ")");
    
    var widthField = $("#textfield_camera_sensor_width");
    var heightField = $("#textfield_camera_sensor_height");
    
    widthField.val(window.blam.cameraPresets[key]["width"]);
    heightField.val(window.blam.cameraPresets[key]["height"]);
    
    if (key != "custom")
    {
        widthField.attr("disabled", "disabled");
        heightField.attr("disabled", "disabled");
    }
    else
    {
        widthField.removeAttr("disabled");
        heightField.removeAttr("disabled");
    }   
}

function createCameraPresets()
{
    //populate the dropdown menu
    var html = '<select id="dropdown_camera_presets">';
    for (var key in window.blam.cameraPresets) {
        html += '<option value="' + key + '">' + window.blam.cameraPresets[key]["name"] + '</option>';
    }
    html += "</select>";
    
    var containerDiv = $("#div_camera_preset_container");
    
    containerDiv.html(html);
    
    $("#dropdown_camera_presets").change(function() 
    {
        setCameraPreset($(this).val());
    });
    
    setCameraPreset("custom");
}

$(document).ready(function() {
    
    
    
    //check HTML5 compatibility
    var errorList = checkBrowserCompatibility();
        
    if (errorList != null)
    {
        //TODO: output errors
        alert(errorList);
        return;
    }
    
    window.blam.ui.init();
    
    
    
    createCameraPresets();
    
});
