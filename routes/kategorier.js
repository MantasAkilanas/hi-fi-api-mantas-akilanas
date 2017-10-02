const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/kategorier', (req, res) => {
        const query = `select produkter.billede, produkter.fk_kategori as id, kategori.navn as kategori
    from produkter inner join
    kategori on fk_kategori = kategori.id`;
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