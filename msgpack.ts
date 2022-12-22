import msgpack from "@ygoe/msgpack";

const data = [
    {"a": 1, "b": 2, "c":3},
    {"a": 1, "b": 2, "c":3},
    {"a": 1, "b": 2, "c":3},
];

var bytes = msgpack.serialize(data);
var obj = msgpack.deserialize(bytes);
console.log({bytes, obj});
