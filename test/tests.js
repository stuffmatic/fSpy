module("Generic math functions");

/*******************************************************
 *                   HELPER FUNCTIONS
 *******************************************************/

/**
 * Scalar equality within a given epsilon.
 */
function scEq(s1, s2, eps) {
    return Math.abs(s1 - s2) < eps;
}

/**
 * Vector equality within a given epsilon.
 */
function vecEq(v1, v2, eps) {
    if (v1.length() != v2.length()) {
        return false
    }
    
    for (var i = 0; i < v1.length(); i++) {
        if (!sqEq(v1[i], v2[i], eps)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Matrix equality within a given epsilon
 */
function vecEq(m1, m2, eps) {
    if (m1.length() != m2.length()) {
        return false
    }
    
    for (var i = 0; i < m1.length(); i++) {
        if (!vecEq(m1[i], m2[i], eps)) {
            return false;
        }
    }
    
    return true;
}

/*******************************************************
 *                      TESTS
 *******************************************************/
test("Vector length", function() {
    
    var vectors = [
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 3],
        [0, 3, 4],
        [3, 0, 4],
        [4, 3, 0],
        [3, 4],
        [6]
    ];
    
    var expectedLengths = [
        1, 2, 3, 5, 5, 5, 5, 6
    ];
    
    for (var i = 0; i < vectors.length; i++) {
        var vec = vectors[i];
        var lExp = expectedLengths[i];
        var l = blam.math.length(vec);
        ok(l == lExp, "Length of [" + vec + "] sould be " + lExp);   
    }
});

test("Vector normlize", function() {
    
    var vectors = [
        [1, 34, 3],
        [0, 2, 4],
        [43.34, 0.03, 4],
        [0, 3],
        [3],
        [4, 3, 3, 5, 34],
        [3, 4],
        [6]
    ];
    
    for (var i = 0; i < vectors.length; i++) {
        var vec = vectors[i];
        var normVec = blam.math.normalize(vec);
        var l = blam.math.length(normVec);
        ok(scEq(l, 1, 0.0000000000001), "Length of normalized vector [" + normVec + "] should be " + 1);
    }
});

test("Vector dot product", function() {
    ok(false);
});

test("Vector cross product", function() {
    ok(false);
});

test("Vector subtract", function() {
    ok(false);
});

test("Matrix to quaternion conversion", function() {
    ok(false);
});

test("Matrix to axis angle", function() {
    ok(false);
});

test("Matrix multiplication", function() {
    ok(false);
});

test("Matrix inverse", function() {
    ok(false);
});

test("Line intersection", function() {
    ok(false);
});

