module("Generic math functions");

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
        ok(l == 1, "Length of normalized vector [" + normVec + "] should be " + 1);
    }
    
  
});

module("module 2");

test("test name 2", function() {
  ok(1 == "1", "Tag 2" );
});