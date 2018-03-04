#Algorithms
##1 vp

* input
  * vp 1
  * principal point (deafults to midpoint)
  * focal length
  * horizon angle (defalts to horizontal)
  
* output
  * compute vp 2 from input parameters

##2 vp

* input
  * vp 1
  * vp 2
  * principal point __or__ vp 3
  
* output
  * compute princpial point P from vp 1 2 and 3, if vp 3 is given
  * compute focal length from vp 1, vp 2 and P

##Common

* compute camera rotation matrix from vp 1, vp 2 and P
* ```Transform``` 4x4
* ```Vector3D```
* 