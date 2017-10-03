const mysql = require("mysql2");
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
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
                    res.json(200,{
                        "message": "Brugernavn eller email er optaged"
                    })
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
                                "message": "Brugernavn eller email er optaged",
                                "error": err
                            })
                        }
                        else {
                            res.json(200, {

                                "message": "Data indsat"
                            })
                        }
                    })
                }
            }
        })
    });
    server.post('/login', (req, res) => {
        
                let values = [];
                values.push(req.body.brugernavn);
                values.push(req.body.password);
                console.log(values);
                connection.query(`select * from account where account.brugernavn = ? and account.password = ?`, values, (err, results) => {
                    if (err) {
                        console.log("fejl");
                        console.log(err);
                    }
                    else {
                        console.log("ok");
                        console.log(results);
                        if (results.length > 0) {
                            console.log("occupied");
                            res.json(200,{
                                "message": "you have succesfully loged in"
                            })
                        }
                        else {
                            res.json(200,{
                                "message":"wrong username or password"
                            })
                        }
                    }
                })
            });
}
