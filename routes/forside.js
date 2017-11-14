const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/forside', (req, res) => {
        const query = `select produkter.*, kategori.navn as kategori, producent.navn as producent
    from produkter
    inner join kategori
        on fk_kategori = kategori.id
    inner join producent
        on fk_producent = producent.id where produkter.visible = 1 order by id desc limit 4`;
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