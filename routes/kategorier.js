const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/kategorier', (req, res) => {
        const query = `select distinct navn as kategori, id
    from kategori`;
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500);
                res.end;
            }
            else {
                res.setHeader('Access-Control-Allow-Origin', "*");
                res.send(results);
            }
        });
    })
}