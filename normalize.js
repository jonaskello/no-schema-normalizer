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
console.log(util.inspect(result, { showHidden: false, depth: null }));

function normalize(data) {
  const cache = {};
  const result = buildCacheRecursive(data, cache);
  return {
    result: result,
    cache: cache
  };
}

function buildCacheRecursive(obj, cache) {
  const objectId = getObjectId(obj);
  cache[objectId] = obj;
  for (const key of Object.keys(obj)) {
    const keyObj = obj[key];
    if (Array.isArray(keyObj)) {
      const arr = keyObj;
      let i = 0;
      while (i < arr.length) {
        const item = arr[i];
        if (isObject(item)) {
          const subObjectId = buildCacheRecursive(item, cache);
          arr[i] = subObjectId;
          i++;
        } else {
          i++;
        }
      }
    } else if (isObject(keyObj)) {
      const subObjectId = buildCacheRecursive(keyObj, cache);
      obj[key] = subObjectId;
    }
  }
  //return obj;
  return objectId;
}

function getObjectId(obj) {
  return obj.id;
}

// tslint:disable-next-line:no-any
function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}
