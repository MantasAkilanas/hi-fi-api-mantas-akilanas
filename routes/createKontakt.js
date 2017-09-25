const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.post('/createKontakt', (req, res) => {

        let values = [];
        values.push(req.body.navn);
        values.push(req.body.mobil);
        values.push(req.body.email);
        console.log(values);
        connection.execute('insert into kontakt(navn,mobil,email) values (?,?,?)', values, (err, rows) => {
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
}