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

function setCameraPreset(idx)
{
    console.log("setCameraPreset(idx=" + idx + ")");
    
    var widthField = $("#textfield_camera_sensor_width");
    var heightField = $("#textfield_camera_sensor_height");
    
    widthField.val(window.blam.cameraPresets[idx][1]);
    heightField.val(window.blam.cameraPresets[idx][2]);
    
    if (idx != 0)
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
    //TODO: preset IDs
    //[Name, sensor width in mm, sensor height in mm]
    window.blam.cameraPresets =
    [
        ["Custom camera", 36, 24],
        ["APS-C DSLR", 22.3, 14.9],
        ["Canon 1D", 27.9, 18.6],
        ["Canon 1DS", 36, 24],
        ["Canon 5D", 36, 24],
        ["Canon 5D", 36, 24],
        ["Canon 7D", 22.3, 14.9],
        ["Canon 60D", 22.3, 14.9],
        ["Canon 500D", 22.3, 14.9],
        ["Canon 550D", 22.3, 14.9],
        ["Canon 600D", 22.3, 14.9],
        ["Canon 1100D", 22.2, 14.7],
        ["35 mm film", 36, 24],
        ["Micro four thirds", 17.3, 14],
        ["Nikon D3S", 36, 23.9],
        ["Nikon D90", 23.6, 15.8],
        ["Nikon D300S", 23.6, 15.8],
        ["Nikon D3100", 23.1, 15.4],
        ["Nikon D5000", 23.6, 15.8],
        ["Nikon D5100", 23.6, 15.6],
        ["Nikon D7000", 23.6, 15.6],
        ["Red Epic", 30, 15],
        ["Red Epic 2k", 11.1, 6.24],
        ["Red Epic 3k", 16.65, 9.36],
        ["Red Epic 4k", 22.2, 12.6],
        ["Sony A55", 23.4, 15.6],
        ["Super 16 film", 12.52, 7.41],
        ["Super 35 film", 24.89, 18.66]
    ];
    
    //populate the dropdown menu
    var html = '<select id="dropdown_camera_presets">';
    for (var i = 0; i < window.blam.cameraPresets.length; i++)
    {
        html += '<option value="' + i + '">' + window.blam.cameraPresets[i][0] + '</option>';
    }
    html += "</select>";
    
    var containerDiv = $("#div_camera_preset_container");
    
    containerDiv.html(html);
    
    containerDiv.change(function() 
    {
        setCameraPreset($(this).val());
    });
    
    setCameraPreset(0);
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
    onNumVanishingPointsChanged();
});
