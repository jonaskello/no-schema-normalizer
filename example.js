"use strict";

const Normalizer = require("./normalizer");

const data = {
  id: "123",
  author: {
    id: "1",
    name: "Paul"
  },
  title: "My awesome blog post",
  comments: [
    {
      id: "324",
      commenter: {
        id: "2",
        name: "Nicole"
      }
    }
  ]
};

const result = Normalizer.normalize(data);

const util = require("util");
console.log("NORMALIZE:");
console.log(util.inspect(result, { showHidden: false, depth: null }));

console.log("DENORMALIZE:");
const denorm = Normalizer.denormalize(result.result, result.entities);
console.log(util.inspect(denorm, { showHidden: false, depth: null }));
