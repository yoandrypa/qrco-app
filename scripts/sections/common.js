const handler = (item, elems) => {
  const resp = {};

  for (let i = 0, l = elems.length; i < l; i += 1) {
    const elem = elems[i];
    if (item[elem] !== undefined) {
      resp[elem] = item[elem];
    }
  }

  return resp;
}

module.exports = handler;
