"use strict"

//Exporting a Module : Example 3
var sayEndInEnglish = function() {
  console.log("End");
}

var sayEndInSpanish = function() {
  console.log("Fin");
};


exports.sayEndInEnglish = sayEndInEnglish;
exports.sayEndInSpanish = sayEndInSpanish;
