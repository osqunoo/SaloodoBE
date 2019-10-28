var Client = require('ftp');
var fs = require('fs');
const uuidv5 = require('uuid/v5');
var uniqid= require('uniqid');
var config = require('../config');
var PromiseFTP = require('promise-ftp');

module.exports = {
    getFile:  function (req, res) {
        if(req.query.folderName === null || req.query.folderName === '' || req.query.folderName == '-1'){
            return res.send(null);
        }
        var folderName = req.query.folderName;
        var path = `./${folderName}/${req.query.fileName}`;
        var ftp = new PromiseFTP();
         ftp.connect(config.ftpConfig).then(function(serverMessage){
            return ftp.get(path);
        }).then(function(stream){
             new Promise(function(resolve, reject){
                stream.once('close', resolve);
                stream.once('error', reject);
                stream.pipe(res);
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                ftp.end();
            });
        });
    },
    saveFile: function (req, res) {
        var folderName = req.query.folderName;
        var fileName = req.query.fileName;
        var ftp = new Client();
        var path = `./${folderName}/${uniqid()}${req.files.Excel.name.substring(req.files.Excel.name.indexOf('.'),req.files.Excel.name.length)}`;
        var data = fs.readFileSync(req.files.Excel.path);
        ftp.on('ready', function () {
            ftp.put(data, path, false, function (err) {
                if (err) throw err;
                ftp.end();
                return res.json({
                    path: path,
                    code: 1
                })
            });
        });
  
        ftp.connect(config.ftpConfig);
    }
}