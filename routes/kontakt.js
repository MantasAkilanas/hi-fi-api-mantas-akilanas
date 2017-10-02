const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/kontakt', (req, res) => {
        const query = `select *
        from kontakt`;
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
    server.post('/createKontakt', (req, res) => {

        let values = [];
        values.push(req.body.navn);
        values.push(req.body.mobil);
        values.push(req.body.email);
        values.push(req.body.besked);
        console.log(values);
        connection.execute('insert into kontakt(navn,mobil,email,besked) values (?,?,?,?)', values, (err, rows) => {
            if (err) {
                console.log(err);
                res.json(500, {
                    "message": "Internal Server Error",
                    "error": err
                })
            }
            else {
                res.json(200, {

                    "message": "Data indsat"
                })
            }
        })
    });
};