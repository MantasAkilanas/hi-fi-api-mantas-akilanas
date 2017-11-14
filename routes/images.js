const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
const mimetypes = {
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif"
};
module.exports = (server) => {
    server.get('/image/:id', (req, res) => {
        fs.readFile(`./public/assets/media/${req.params.id}`, function (err, fileContent) {
            if (err) {
                res.json(500, {
                    "message": "Internal Server Error",
                    "error": err
                })
                return;
            }
            var ext = path.extname(req.params.id);
            var mime = mimetypes[ext];
            res.writeHead(200, { "Content-type": mime })
            res.end(fileContent);
        })
    })
    server.post('/image', (req, res) => {
        
    })
};