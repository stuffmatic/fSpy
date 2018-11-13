# fSpy project file format

## Binary file structure

An fSpy project file consists of the following parts in the following order, where `uint32` is an unsigned 4 byte little endian integer:

* __`file_id`__  - 4 x `uint8`
  
  `0x66`, `0x73`,  `0x70`, `0x79` (`f`, `s`, `p`, `y` in ASCII)
* __`project_file_version`__ - `uint32`
  
  `1`
* __`state_size`__ - `uint32`
  
  The size in bytes of the project state JSON data
* __`image_size`__ - `uint32`
  
  The size in bytes of the project image data. May be 0.
* __Project state data__
  
  A `state_size` byte JSON string describing the project state
* __Image data__
  
  `image_size` bytes of binary image data.
  
## Project state data

The project state data describes the state of the entire fSpy project. If camera parameters are stored under the `cameraParameters` attribute. Note that the camera parameters can be null for example if the vanishing points are invalid.

## Image data

The image data is a binary blob of image data. The fSpy code is not aware of the format of the data. As long as Electron can load it, it's considered valid.