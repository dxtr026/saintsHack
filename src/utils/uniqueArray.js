Array.prototype.unique = function () {
  var newObj = {}
  this.forEach(function (element, index) {
    newObj[element] = 'val'
  })
  return Object.keys(newObj)
}
