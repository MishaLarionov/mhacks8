$(document).ready(function() {
  var el1 = $(".grid-1-item");
  for (i=0 ; i<143 ; i++) {
    var newEl1 = el1.clone();
    $(".grid-1").append(newEl1);
  }
  var el2 = $(".grid-2-item");
  for (i=0 ; i<143 ; i++) {
    var newEl2 = el2.clone();
    $(".grid-2").append(newEl2);
  }
});