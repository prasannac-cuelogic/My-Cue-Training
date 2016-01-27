"use strict"

//Exporting a Module : Example 1
module.exports = {
    sayHelloInEnglish: sayHelloInEnglish,
    sayHelloInSpanish: sayHelloInSpanish
};

function sayHelloInEnglish() {
  console.log("Hello");
};

function sayHelloInSpanish() {
  console.log("Hola");
};


