var path = require('path'),
  fs = require('fs');

var db = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, './test.db')
  }
};

function sample(key, callback){
  return fs.readFile(path.join(__dirname, '../samples', key + '.jsx'), 'utf8', callback);
}