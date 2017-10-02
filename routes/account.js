const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/accountInfo', (req, res) => {
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
    server.post('/createAccount', (req, res) => {

        let values = [];
        values.push(req.body.brugernavn);
        values.push(req.body.email);
        console.log(values);
        connection.query(`select * from account where account.brugernavn = ? or account.email = ?`, values, (err, results) => {
            if (err) {
                console.log("fejl");
                console.log(err);
            }
            else {
                console.log("ok");
                console.log(results);
                if (results.length > 0) {
                    console.log("occupied");
                }
                else {
                    console.log("accepted");
                    values = [];
                    values.push(req.body.brugernavn);
                    values.push(req.body.password);
                    values.push(req.body.email);
                    console.log(values);
                    connection.execute('insert into account(brugernavn,password,email) values (?,?,?)', values, (err, rows) => {
                        if (err) {
                            console.log(err);
                            res.json(500, {
                                "message": "Internal Server Error",
                                "error": err
                            })
                        }
                        else {
                            res.json(201, {

                                "message": "Data indsat", "error" :"noget"
                            })
                        }
                    })
                }
            }

            //     // results.forEach(function (element) {
            //     if (brugernavn != element.brugernavn || element.email != email) {
            // let values = [];
            // values.push(req.body.brugernavn);
            // values.push(req.body.password);
            // values.push(req.body.email);
            // console.log(values);
            // connection.execute('insert into account(brugernavn,password,email) values (?,?,?)', values, (err, rows) => {
            //     if (err) {
            //         console.log(err);
            //         res.json(500, {
            //             "message": "Internal Server Error",
            //             "error": err
            //         })
            //     }
            //     else {
            //         res.json(200, {

            //             "message": "Data indsat"
            //         })
            //     }
            // })
            //     }
            // });
        })
    });
}
