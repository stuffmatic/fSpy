import Transform from "./math/transform";

class VanishingLinePair {
  firstLine:LineSegment
  secondLine:LineSegment
  get vanishingPoint():Point2D {
    return new Point2D()
  }
}

class CalibrationInputParametersSingle {
  origin:Point2D
  vanishingLinePair1:VanishingLinePair
  principalPoint?:Point2D
  horizonLine?:LineSegment
  focalLength?:number
}

class CalibrationInputParametersDouble {
  origin:Point2D
  vanishingLinePair1:VanishingLinePair
  vanishingLinePair2:VanishingLinePair
  vanishingLinePair3OrPrincipalPoint?:VanishingLinePair | Point2D
}

class CalibrationResult {
  cameraTransform:Transform
  vanishingPoint1:Point2D
  vanishingPoint2?:Point2D
  vanishingPoint3?:Point2D

}

class CalibrationSolver {

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
    private computeSecondVanishingPoint(Fu:Point2D, f:number, P:Point2D, horizonDir:Point2D): Point2D
    {
        //find the second vanishing point
        //TODO 1: take principal point into account here
        //TODO 2: if the first vanishing point coincides with the image center,
        //        these lines won't work, but this case should be handled somehow.

        var F = [Fu[0] - P[0], Fu[1] - P[1]];

        var k = -(F[0] * F[0] + F[1] * F[1] + f * f) / (F[0] * horizonDir[0] + F[1] * horizonDir[1]);
        var Fv = [F[0] + k * horizonDir[0], F[1] + k * horizonDir[1]];

        return Fv
    }

    /**
     * Computes a thrid vanishing point based on two vanishing points
     * and the optical center.
     */
    private computeThirdVanishingPoint(Fu:Point2D, Fv:Point2D, P:Point2D) {

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
    private computeFocalLength(Fu:Point2D, Fv:Point2D, P:Point2D)
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
    computeTriangleOrthocenter(verts:Point2D[]):Point2D
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
    computeCameraRotationMatrix(Fu:Point2D, Fv:Point2D, f:number, P:Point2D)
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

}