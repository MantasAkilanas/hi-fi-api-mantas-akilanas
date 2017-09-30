const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/produkt/:id', (req, res) => {
        const query = `select produkter.billede, produkter.navn, produkter.id as varenr, produkter.pris, produkter.antal, kategori.navn as kategori, producent.navn as producent
        from produkter
        inner join kategori
        on fk_kategori = kategori.id
        inner join producent
        on fk_producent = producent.id
        where produkter.id = ?
        `;
        connection.query(query,[req.params.id], (err, results) => {
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