# Projector calibration using fSpy

⚠️ This is a work-in-progress document outlining the steps to perform projector calibration using fSpy and Blender. Note that this functionality is experimental and pretty much untested at the time of writing and requires a [recent beta build of fSpy](https://github.com/stuffmatic/fSpy/releases).

## Performing calibration in fSpy

1. Create an image with the same resolution as the projector
2. Open the image in fSpy
3. Point the projector so that its viewport is projected onto an object with suitable perpendicular edges, e.g a table or a box.
4. Enter full screen mode (view -> enter full screen mode)
5. Position the fSpy control points as usual
6. Exit full screen mode (view -> leave full screen mode)
7. Save the fSpy project file.

## Blender import

1. Import the project file into Blender using the [importer add-on](https://github.com/stuffmatic/fSpy-Blender). This creates a new and properly calibrated camera.
2. In order to create 3D geometry based on the calibrated camera, it's vital that the Blender camera's viewport fits the screen perfectly. This can be achieved with the following steps (that should probably be automated in the future)
    * Enter full screen mode in Blender (window -> enter full screen)
    * Set the viewpoint to be the calibrated camera (numpad 0)
    * Make the 3D view cover the entire screen by positioning the mouse pointer in the 3D view and pressing ctrl-alt-space (pressing ctrl-alt-space again goes back to normal view).
    * Press F3, search for and select "View camera center" (pressing home should also work). This makes the camera viewport fit the screen.
    * For a more immersive experience, disable overlays and gizmos (button in the upper right corner of the 3D view)
3. By now, the Blender viewport and camera should match the scene the projector is projectin onto. 
