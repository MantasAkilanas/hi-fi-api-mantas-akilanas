const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/kategorier', (req, res) => {
        const query = `select distinct navn as kategori, id
    from kategori
     order by id desc`;
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
    }),
    server.get('/produkter', (req, res) => {
        const query = `select produkter.*, kategori.navn as kategori, producent.navn as producent
        from produkter
        inner join kategori
            on fk_kategori = kategori.id
        inner join producent
            on fk_producent = producent.id order by id desc`;
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
    });
};