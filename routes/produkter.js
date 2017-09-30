const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/produkter/:id', (req, res) => {
        const query = `select produkter.*, kategori.navn as kategori, producent.navn as producent
        from produkter
        inner join kategori
            on fk_kategori = kategori.id
        inner join producent
            on fk_producent = producent.id where fk_kategori = ?`;
        connection.query(query, [req.params.id], (err, results) => {
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
    server.get('/produkter', (req, res) => {
        const query = `select produkter.*, kategori.navn as kategori, producent.navn as producent
        from produkter
        inner join kategori
            on fk_kategori = kategori.id
        inner join producent
            on fk_producent = producent.id`;
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
    server.get('/search/:id', (req, res) => {
        //const prepare = `${req.params.id}`
        //console.log(prepare);
        const query = `select produkter.*, kategori.navn as kategori, producent.navn as producent
        from produkter
        inner join kategori
            on fk_kategori = kategori.id
        inner join producent
            on fk_producent = producent.id
            where kategori.navn like "%"?"%"
            or produkter.id like "%"?"%"
            or produkter.navn like "%"?"%"
            or producent.navn like "%"?"%"
            `;
        connection.query(query,[req.params.id,req.params.id,req.params.id,req.params.id], (err, results) => {
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