"use strict";

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

const result = normalize(data);

const util = require("util");
console.log("NORMALIZE:");
console.log(util.inspect(result, { showHidden: false, depth: null }));

console.log("DENORMALIZE:");
const denorm = denormalize(result.result, result.entities);
console.log(util.inspect(denorm, { showHidden: false, depth: null }));

function normalize(data) {
  const entities = {};
  const result = normalizeRecursive(data, entities);
  return {
    result: result,
    entities: entities
  };
}

function denormalize(result, entities) {
  let output;
  if (Array.isArray(result)) {
    output = result.map(item => denormalizeValue(item, entities));
  } else {
    output = denormalizeValue(result, entities);
  }
  return output;
}

// Denormalizes the value if it is an ID, otherwise just returns the value
function denormalizeValue(value, entities) {
  // Check if it is an ID
  if (!isId(value, entities)) {
    return value;
  }
  // If we find a object in the cache let's assume it is an ID
  const normalizedObj = entities[idToCacheKey(value)];
  if (normalizedObj) {
    const denormalizedObj = {};
    for (const key of Object.keys(normalizedObj)) {
      const keyObj = normalizedObj[key];
      if (key === "id") {
        // Skip this!
        denormalizedObj[key] = keyObj;
      } else if (Array.isArray(keyObj)) {
        // This could either be an array of values, or an array of IDs
        denormalizedObj[key] = keyObj.map(item =>
          denormalizeValue(item, entities)
        );
      } else {
        denormalizedObj[key] = denormalizeValue(keyObj, entities);
      }
    }
    return denormalizedObj;
  } else {
    return value;
  }
}

function normalizeRecursive(obj, cache) {
  const objectId = createId(obj);
  cache[idToCacheKey(objectId)] = obj;
  for (const key of Object.keys(obj)) {
    const keyObj = obj[key];
    if (Array.isArray(keyObj)) {
      const arr = keyObj;
      let i = 0;
      while (i < arr.length) {
        const item = arr[i];
        if (isObject(item)) {
          const subObjectId = normalizeRecursive(item, cache);
          arr[i] = subObjectId;
          i++;
        } else {
          i++;
        }
      }
    } else if (isObject(keyObj)) {
      const subObjectId = normalizeRecursive(keyObj, cache);
      obj[key] = subObjectId;
    }
  }
  return objectId;
}

// Create an ID that can be used for normalized cahce
// Can for example create an object of a special class
// and then in idToString() check if it is an instance of that class
function createId(obj) {
  return obj.id;
}

// Returns a string representation of the ID that can be used as a cache key
// in a plain JS object
function idToCacheKey(id) {
  return id;
}

// If value is a ID then return true
function isId(value, entities) {
  if (typeof value === "string") {
    // If we find a object in the cache let's assume it is an ID
    if (entities[value]) {
      return true;
    }
  }
  return false;
}

function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}
