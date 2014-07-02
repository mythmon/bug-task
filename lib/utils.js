var Promise = require('es6-promises');

module.exports.denodeify = function(func, args, this_) {
  return new Promise(function(resolve, reject) {
    args.push(function(err, val) {
      if (err) {
        reject(err);
      } else {
        resolve(val);
      }
    });
    func.apply(this_, args);
  });
};
