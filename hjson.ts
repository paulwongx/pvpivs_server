import Hjson from "hjson";

const data = [
    {"a": 1, "b": 2, "c":3},
    {"a": 1, "b": 2, "c":3},
    {"a": 1, "b": 2, "c":3},
];

var text2 = Hjson.stringify(data);
var obj = Hjson.parse(text2);
console.log({obj, text2});
