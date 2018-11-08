# Fix

* sort out naming of camera transform (or its inverse)
* camera sensor dimensios vs portrait images
* hide axis when reference distance is enabled
* flickering when opening project
* export menu -> JSON, project image
* view menu -> view tool panels
* help menu with link to site
* add appropriate entries to the macos fSpy menu

# Fix

* Den kraschar när jag vill starta nytt projekt - Linux

# build
* silence test warning

# linux
* crisper icon (use nativeimage?)
* name: fSpy instead of fspy

# future

* actions name space
* måste funka att ta bort kamera-preset mitt mellan save och open
* opening by double click opens project in example project mode
* about window?
* revert to saved
* full screen mode for projector use
* tooltips
* warn when reference distance handles go past the measuring axis vp
* disallow selecting parallel vp axes?
* zoom
* I imported a camera via the python script and all worked well except it doesn’t use the sensor size I set in fSpy.
The field of view is right, though. It uses 32mm instead of 35mm full frame but adjusted the focal length accordingly. It would be nice if the script also adjusted the sensor size to match the one in fSpy.
* It would also be a lot easier if the generated script would automatically add a photo path as a camera background in a blender - from what I remember BLAM did it automatically as well as change of camera dimensions based on image resolution.
* Can it be made possible to place the principal point outside the image area?
* ~~I request lens data from G7X Mark II into this plugin, the G7X Mark II is a very popular camera.~~