module("module 1");

test("test name 1", function() {
  ok(1 == "1", "Tag 1" );
});

test("test name 2", function() {
  ok(1 == "1", "Tag 1" );
});

test("test name 3", function() {
  ok(1 == "1", "Tag 1" );
});

module("module 2");

test("test name 2", function() {
  ok(1 == "1", "Tag 2" );
});