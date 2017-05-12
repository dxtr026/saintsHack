export default function (arr, key, val, index=false) {
  let validObj = {};
  let ind;
  arr.forEach((arrItem, i) => {
    if (arrItem[key] && arrItem[key] == val) {
      validObj = arrItem;
      ind = i;
    }
  });
  return index ? ind : validObj;
}
