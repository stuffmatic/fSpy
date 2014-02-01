window.blam = window.blam || {}
blam.math = blam.math || {}

blam.math = (function() {
    
    /**************************************************************************************
     *                         GENERIC MATH HELPER FUNCTIONS
     **************************************************************************************/
    
    /**
     * Returns the length of a vector.
     * @param vec The vector (in the form of an array)
     * @return The length of the vector \c vec.
     */
    this.length = function (vec)
    {
        var lSq = 0.0;
    
        for (var i = 0; i < vec.length; i++)
        {
            lSq += vec[i] * vec[i];
        }
    
        return Math.sqrt(lSq);    
    }
    
    /**
     * Returns a unit vector in a given direction.
     * @param vec The direction.
     * @return A unit vector in the direction of \c vec.
     */
    this.normalize = function(vec)
    {
        var l = length(vec);
        var result = zeroVector(vec.length);
    
        if (l == 0.0)
        {
            return result;
        }
    
        for (var i = 0; i < vec.length; i++)
        {
            result[i] = vec[i] / l;
        }
    
        return result;
    }

    /**
     * Computes the dot product of two vectors.
     * @param v1 The first vector.
     * @param v2 The second vector.
     * @return The dot product of \c v1 and \c v2.
     */
    this.dot = function(v1, v2)
    {
        assert(v1.length == v2.length);
    
        var ret = 0.0;
    
        for (var i = 0; i < v1.length; i++)
        {
            ret += v1[i] * v2[i];
        }
    
        return ret;
    }

    /**
     * Computes the difference between two vectors.
     * @param v1 The first vector.
     * @param v2 The second vector.
     * @return The difference \c v1 - \c v2.
     */
    this.vecSubtract = function(v1, v2)
    {
        assert(v1.length == v2.length);
        var result = zeroVector(v1.length);
    
        for (var i = 0; i < v1.length; i++)
        {
            result[i] = v1[i] - v2[i];
        }
    
        return result;
    }

    /**
     * Row major projection matrix
     */
    this.computeProjectionMatrix = function(params)
    {
        var result = new Array(16);
        for (var i = 0; i < 16; i++)
        {
            result[i] = 0.0;
        }
    
        var toRadians = (Math.PI / 360.0);
        var h = tanf(params[0] * toRadians); //fov in degrees
        var w = params[1] * h; //aspect ratio
        var near = params[2]; //near
        var far = params[3]; //far
        var d = far - near;
    
        if (d <= 0.0)
        {
            assert(false);
        }
    
        //row-major
        result[0] = 1.0 / w;
        result[5] = 1.0 / h;
        result[10] = -(near + far) / d;
        result[11] = -2.0 * near * far / d;
        result[14] = -1.0;
    
        return result;
    }

    this.zeroVector = function (n)
    {
        var result = new Array(n);
    
        for (var i = 0; i < n; i++)
        {
            result[i] = 0.0;
        }
    
        return result;
    }

    this.identityMatrix = function(n)
    {
        var m = zeroVector(n * n);
    
        for (var i = 0; i < n; i++)
        {
            m[n * i + i] = 1.0;
        }
    
        return m;
    }

    /**
     *
     */
    this.matrixToQuat = function(m)
    {
        var qw = Math.sqrt(1 + m[0][0] + m[1][1] + m[2][2]) / 2.0;
        var qx = (m[2][1] - m[1][2]) / (4 * qw);
        var qy = (m[0][2] - m[2][0]) / (4 * qw);
        var qz = (m[1][0] - m[0][1]) / (4 * qw);
    
        return [qw, qx, qy, qz];
    }

    /**
     *
     */
    this.matrixToAxisAngle = function(m)
    {
        var angle = Math.acos((m[0][0] + m[1][1] + m[2][2] - 1) / 2);
        var den = Math.sqrt((m[2][1] - m[1][2]) * (m[2][1] - m[1][2]) + (m[0][2] - m[2][0]) * (m[0][2] - m[2][0]) + (m[1][0] - m[0][1]) * (m[1][0] - m[0][1]));
        x = (m[2][1] - m[1][2]) / den;
        y = (m[0][2] - m[2][0]) / den;
        z = (m[1][0] - m[0][1]) / den;
    
        return [x, y, z, angle];
    }

    /**
     *
     */
    this.multiply4x4Matrix = function(left, right)
    {
        var result = new Array(16);
    
        for (var r = 0; r < 4; r++)
        {
            for (var c = 0; c < 4; c++)
            {
                var rc = 0.0;
                for (var i = 0; i < 4; i++)
                {
                    rc += left[r * 4 + i] * right[c + 4 * i];
                }
            
                result[r * 4 + c] = rc;
            }
        }
    
        return result;
    }

    /**
     *
     */
    this.invert4x4Matrix = function(m)
    {
        var tmp = new Array(16);
        var matrix = new Array(16);
    
        //calculate pairs for first 8 elements (cofactors)
        tmp[0] = m[10]*m[15];
        tmp[1] = m[11]*m[14];
        tmp[2] = m[9]*m[15];
        tmp[3] = m[11]*m[13];
        tmp[4] = m[9]*m[14];
        tmp[5] = m[10]*m[13];
        tmp[6] = m[8]*m[15];
        tmp[7] = m[11]*m[12];
        tmp[8] = m[8]*m[14];
        tmp[9] = m[10]*m[12];
        tmp[10] = m[8]*m[13];
        tmp[11] = m[9]*m[12];
    
        //calculate first 8 elements (cofactors)
        matrix[0] = tmp[0]*m[5] + tmp[3]*m[6] + tmp[4]*m[7];
        matrix[0] -= tmp[1]*m[5] + tmp[2]*m[6] + tmp[5]*m[7];
        matrix[1] = tmp[1]*m[4] + tmp[6]*m[6] + tmp[9]*m[7];
        matrix[1] -= tmp[0]*m[4] + tmp[7]*m[6] + tmp[8]*m[7];
        matrix[2] = tmp[2]*m[4] + tmp[7]*m[5] + tmp[10]*m[7];
        matrix[2] -= tmp[3]*m[4] + tmp[6]*m[5] + tmp[11]*m[7];
        matrix[3] = tmp[5]*m[4] + tmp[8]*m[5] + tmp[11]*m[6];
        matrix[3] -= tmp[4]*m[4] + tmp[9]*m[5] + tmp[10]*m[6];
        matrix[4] = tmp[1]*m[1] + tmp[2]*m[2] + tmp[5]*m[3];
        matrix[4] -= tmp[0]*m[1] + tmp[3]*m[2] + tmp[4]*m[3];
        matrix[5] = tmp[0]*m[0] + tmp[7]*m[2] + tmp[8]*m[3];
        matrix[5] -= tmp[1]*m[0] + tmp[6]*m[2] + tmp[9]*m[3];
        matrix[6] = tmp[3]*m[0] + tmp[6]*m[1] + tmp[11]*m[3];
        matrix[6] -= tmp[2]*m[0] + tmp[7]*m[1] + tmp[10]*m[3];
        matrix[7] = tmp[4]*m[0] + tmp[9]*m[1] + tmp[10]*m[2];
        matrix[7] -= tmp[5]*m[0] + tmp[8]*m[1] + tmp[11]*m[2];
    
        //calculate pairs for second 8 elements (cofactors)
        tmp[0] = m[2]*m[7];
        tmp[1] = m[3]*m[6];
        tmp[2] = m[1]*m[7];
        tmp[3] = m[3]*m[5];
        tmp[4] = m[1]*m[6];
        tmp[5] = m[2]*m[5];
        tmp[6] = m[0]*m[7];
        tmp[7] = m[3]*m[4];
        tmp[8] = m[0]*m[6];
        tmp[9] = m[2]*m[4];
        tmp[10] = m[0]*m[5];
        tmp[11] = m[1]*m[4];
    
        //calculate second 8 elements (cofactors)
        matrix[8] = tmp[0]*m[13] + tmp[3]*m[14] + tmp[4]*m[15];
        matrix[8] -= tmp[1]*m[13] + tmp[2]*m[14] + tmp[5]*m[15];
        matrix[9] = tmp[1]*m[12] + tmp[6]*m[14] + tmp[9]*m[15];
        matrix[9] -= tmp[0]*m[12] + tmp[7]*m[14] + tmp[8]*m[15];
        matrix[10] = tmp[2]*m[12] + tmp[7]*m[13] + tmp[10]*m[15];
        matrix[10] -= tmp[3]*m[12] + tmp[6]*m[13] + tmp[11]*m[15];
        matrix[11] = tmp[5]*m[12] + tmp[8]*m[13] + tmp[11]*m[14];
        matrix[11] -= tmp[4]*m[12] + tmp[9]*m[13] + tmp[10]*m[14];
        matrix[12] = tmp[2]*m[10] + tmp[5]*m[11] + tmp[1]*m[9];
        matrix[12] -= tmp[4]*m[11] + tmp[0]*m[9] + tmp[3]*m[10];
        matrix[13] = tmp[8]*m[11] + tmp[0]*m[8] + tmp[7]*m[10];
        matrix[13] -= tmp[6]*m[10] + tmp[9]*m[11] + tmp[1]*m[8];
        matrix[14] = tmp[6]*m[9] + tmp[11]*m[11] + tmp[3]*m[8];
        matrix[14] -= tmp[10]*m[11] + tmp[2]*m[8] + tmp[7]*m[9];
        matrix[15] = tmp[10]*m[10] + tmp[4]*m[8] + tmp[9]*m[9];
        matrix[15] -= tmp[8]*m[9] + tmp[11]*m[10] + tmp[5]*m[8];
    
        //calculate determinant
        var det = m[0]*matrix[0] + m[1]*matrix[1] + m[2]*matrix[2] + m[3]*matrix[3];
    
        //matrix is singular?
        if (det == 0.0)
        {
            //assert(0 && "singular matrix");
        }
    
        //divide out the determinant
        det = 1.0 / det;
        for (var i = 0; i < 16; ++i)
        {
            matrix[i] *= det;
        }
    
    
        //copy the result back to m, transposed
        for (var j = 0; j < 4; ++j)
        {
            for (var i = 0; i < 4; ++i)
            {
                tmp[(i << 2) + j] = matrix[(j << 2) + i];
            }
        }
    
        return tmp;
    }
    
    /**
     * 
     */
    this.computeIntersectionPoint = function(segment1, segment2)
    {
        var x1 = segment1[0][0];
        var y1 = segment1[0][1];
    
        var x2 = segment1[1][0];
        var y2 = segment1[1][1];
    
        var x3 = segment2[0][0];
        var y3 = segment2[0][1];
    
        var x4 = segment2[1][0];
        var y4 = segment2[1][1];
    
        var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
        var x = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
        x = x / denom;
    
        var y = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
        y = y / denom;
    
        return [x, y];
    }
    
    /**************************************************************************************
     *                         CALIBRATION HELPER FUNCTIONS
     **************************************************************************************/

    /**
     * Aspect = w / h
     */ 
    this.relIm2ImPlane = function(p, aspect) {
        return [2.0 * p[0] - 1.0, (2.0 * p[1] - 1.0) / aspect]
    }
    
    /**
     * Aspect = w / h
     */ 
    this.imPlane2RelIm = function(p, aspect) {
        return [(p[0] + 1.0) / 2.0,  (p[1] * aspect + 1.0) / 2.0];
    }

    /**
     * Computes the coordinates of the second vanishing point
     * based on the first, a focal length, the center of projection and
     * the desired horizon tilt angle. The equations here are derived from
     * section 3.2 "Determining the focal length from a single image".
     * @param Fu the first vanishing point in normalized image coordinates.
     * @param f the relative focal length.
     * @param P the center of projection in normalized image coordinates.
     * @param horizonDir The desired horizon direction.
     * @return The coordinates of the second vanishing point.
     * @see http://www.irisa.fr/prive/kadi/Reconstruction/paper.ps.gz
     */
    this.computeSecondVanishingPoint = function(Fu, f, P, horizonDir)
    {
        //find the second vanishing point
        //TODO 1: take principal point into account here
        //TODO 2: if the first vanishing point coincides with the image center,
        //        these lines won't work, but this case should be handled somehow.
                
        var k = -(Fu[0] * Fu[0] + Fu[1] * Fu[1] + f * f) / (Fu[0] * horizonDir[0] + Fu[1] * horizonDir[1]);
        var Fv = [Fu[0] + k * horizonDir[0], Fu[1] + k * horizonDir[1]];
        
        return Fv
    }
    
    /**
     * Computes a thrid vanishing point based on two vanishing points 
     * and the optical center.
     */
    this.computeThirdVanishingPoint = function(Fu, Fv, P) {
        
        //the optical center is the orthocenter of the triangle formed by Fu, Fv and Fw, the 
        //third vanihsing point to compute.
        
        var e = normalize(vecSubtract(Fv, Fu));
        var n = [e[1], -e[0]];
        var PFu = vecSubtract(P, Fu);
        var PFuDote = dot(PFu, e);
        var m = [Fu[0] + PFuDote * e[0], Fu[1] + PFuDote * e[1]];
        
        var num = (Fu[0] - m[0]) * (Fv[0] - P[0]) + (Fu[1] - m[1]) * (Fv[1] - P[1]);
        var den = n[0] * (Fv[0] - P[0]) + n[1] * (Fv[1] - P[1]);
        
        var k = num / den;
        
        return [m[0] + n[0] * k, m[1] + n[1] * k];
    
        
    }

    /**
     * Computes the focal length based on two vanishing points and a center of projection.
     * @see 3.2 "Determining the focal length from a single image"
     * @param Fu the first vanishing point in normalized image coordinates.
     * @param Fv the second vanishing point in normalized image coordinates.
     * @param P the center of projection in normalized image coordinates.
     * @return The relative focal length.
     */
    this.computeFocalLength = function(Fu, Fv, P)
    {
    
        //compute Puv, the orthogonal projection of P onto FuFv
        /*
         var dirFuFv = normalize([x - y for x, y in zip(Fu, Fv)])
         var FvP = [x - y for x, y in zip(P, Fv)]
         var proj = dot(dirFuFv, FvP)
         var Puv = [proj * x + y for x, y in zip(dirFuFv, Fv)]
     
         var PPuv = length([x - y for x, y in zip(P, Puv)])
     
         var FvPuv = length([x - y for x, y in zip(Fv, Puv)])
         var FuPuv = length([x - y for x, y in zip(Fu, Puv)])
         var FuFv = length([x - y for x, y in zip(Fu, Fv)])*/
        //print("FuFv", FuFv, "FvPuv + FuPuv", FvPuv + FuPuv)
    
        var dirFuFv = normalize(vecSubtract(Fu, Fv));
        var FvP = vecSubtract(P, Fv);
        var proj = dot(dirFuFv, FvP);
        var Puv = [proj * dirFuFv[0] + Fv[0], proj * dirFuFv[1] + Fv[1]];
    
        var PPuv = length(vecSubtract(P, Puv));
    
        var FvPuv = length(vecSubtract(Fv, Puv));
        var FuPuv = length(vecSubtract(Fu, Puv));
        var FuFv = length(vecSubtract(Fu, Fv));
    
    
        var fSq = FvPuv * FuPuv - PPuv * PPuv
        //print("FuPuv", FuPuv, "FvPuv", FvPuv, "PPuv", PPuv, "OPuv", FvPuv * FuPuv)
        //console.log("fSq = ", fSq, " = ", FvPuv * FuPuv, " - ", PPuv * PPuv)
        if (fSq < 0)
        {
            return null;
        }
    
        var f = Math.sqrt(fSq);
        //print("dot 1:", dot(normalize(Fu + [f]), normalize(Fv + [f])))
    
        return f
    }

    /**
     * Computes the ortocenter of a triangle given its three corners.
     * @param verts The triangle corners.
     * @return The orthocenter coordinates.
     * @see http://www.mathopenref.com/triangleorthocenter.html
     */
    this.computeTriangleOrthocenter = function(verts)
    {
        assert(verts.length == 3);
        assert(verts[0].length == 2);
        assert(verts[1].length == 2);
        assert(verts[2].length == 2);
    
        A = verts[0];
        B = verts[1];
        C = verts[2];
    
        a = A[0];
        b = A[1];
        c = B[0];
        d = B[1];
        e = C[0];
        f = C[1];
    
        N = b * c+ d * e + f * a - c * f - b * e - a * d;
        x = ((d-f) * b * b + (f-b) * d * d + (b-d) * f * f + a * b * (c-e) + c * d * (e-a) + e * f * (a-c) ) / N;
        y = ((e-c) * a * a + (a-e) * c * c + (c-a) * e * e + a * b * (f-d) + c * d * (b-f) + e * f * (d-b) ) / N;
    
        return [x, y];
    }

    /**
     * Computes the camera rotation matrix based on two vanishing points
     * and a focal length as in section 3.3 "Computing the rotation matrix".
     * @param Fu the first vanishing point in normalized image coordinates.
     * @param Fv the second vanishing point in normalized image coordinates.
     * @param f the relative focal length.
     * @param The matrix Moc
     */
    this.computeCameraRotationMatrix = function(Fu, Fv, f, P)
    {
    
        Fu[0] -= P[0];
        Fu[1] -= P[1];
    
        Fv[0] -= P[0];
        Fv[1] -= P[1];
    
        var OFu = [Fu[0], Fu[1], f];
        var OFv = [Fv[0], Fv[1], f];
    
        //print("matrix dot", dot(OFu, OFv))
    
        var s1 = length(OFu);
        var upRc = normalize(OFu);
    
        var s2 = length(OFv);
        var vpRc = normalize(OFv);
    
        var wpRc = [upRc[1] * vpRc[2] - upRc[2] * vpRc[1],
                    upRc[2] * vpRc[0] - upRc[0] * vpRc[2],
                    upRc[0] * vpRc[1] - upRc[1] * vpRc[0]];
    
        var M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    
        M[0][0] = Fu[0] / s1;
        M[0][1] = Fv[0] / s2;
        M[0][2] = wpRc[0];
    
        M[1][0] = Fu[1] / s1;
        M[1][1] = Fv[1] / s2;
        M[1][2] = wpRc[1];
    
        M[2][0] = f / s1;
        M[2][1] = f / s2;
        M[2][2] = wpRc[2];
    
    
        return M
    }
    
    return this;
}());
