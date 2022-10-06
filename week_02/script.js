
/*
this is a 
block comment
*/

let num = 100; // create an int variable (global scope)
let num1 = 200; 

// function foo() {
//     console.log(num);
//     // let num1 = 200; (functional scope)
// };

console.log(num1);

let anonFun = function() {
    console.log("hello")
};
anonFun();

// Immediately invoked anonymous function (IIFE) - don't need to call it separately
(function() {
    console.log("Hello");
})();

// arrow functions - just a new way to declare a function
(() => console.log(100))();

// function foo() {
//     console.log(num);
// };

/// Reestablish a function
let foo = () => console.log(num);
foo = () => console.log(num1);
foo();


// Arrays
let arr = ["foo", "bar", "zar", 123, ["zar", "foo"]];
console.log(arr[1]); //zero-based

// Set item in array
arr[1] = "bar/bar";
console.log(arr[1]); 

// Add item to the end of the array
arr.push("par");
console.log(arr);

// Removing an item from the array (index, no. of elements to delete)
arr.splice(2,1);
console.log(arr);

let newArr = ["cow", "turtle", "goat"];

// Loop through each item in array
for (let item of newArr) {
    console.log(item);
}

// Loop through the index of each item in array
for (let i in newArr) {
    console.log(i + " " + newArr[i]);
}

// Loop through the index and value of each item in array
newArr.forEach((item, i) => console.log(i + " " + item));


// Objects (similar to dictionaries)
let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter",
};

// Access property
console.log(obj1.name);
console.log(obj1["name"]);

// Set value
obj1.job = "Barista"
console.log(obj1["job"]);

// Loop through all properties (use backticks!)
for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}: ${value}`);
}
// old way of creating strings: let str = `Hello ${key} more text here ${foo}`;

// check data type - typeof 
console.log(typeof obj1["job"]);

// Regular for-loop
for (let i = 0; i < 10; i++) {
    console.log(i);
};

// Conditional, if-else
let val = 80;

if (val > 80) {
    console.log("good");
} else if (val > 50) {
    console.log("okay");
} else {
    console.log("terrible");
};

// Ternary operators (? if, : else - only for binary if-else)
let y = (val >= 80) ? console.log("good") : console.log("not good")

// Traversing the DOM
let newVar = document.getElementById("example");
newVar.innerHTML += "<h1>Hello World</h1>"