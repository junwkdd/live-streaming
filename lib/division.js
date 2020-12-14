exports.division = (arr, n) => {
  const len = arr.length;
  const cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  const temp = [];

  for (let i = 0; i < cnt; i++) {
    temp.push(arr.splice(0, n));
  }

  return temp;
};
