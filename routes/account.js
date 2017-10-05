const mysql = require("mysql2");
const passwordHash = require('password-hash');
const crypto = require('crypto');
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
                    let password = passwordHash.generate(req.body.password);
                    values = [];
                    values.push(req.body.brugernavn);
                    // values.push(req.body.password);
                    values.push(password);
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
                values.push(req.body.brugernavn);;
                console.log(values);
                connection.query(`select * from account where account.brugernavn = ?`, values, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (passwordHash.verify(req.body.password, results[0].password)) {
                            crypto.randomBytes(256, (err, buf) => {
                                if (err) return res.status(500).end();
                                else {
                                    const token = buf.toString('hex');
                                    console.log(results[0].password.length);
                                    connection.execute('INSERT INTO accesstokens SET userid = ?, token = ?', [results[0].id, token], (insError) => {
                                        if (insError) return res.status(500).end();
                                        else return res.send({ "ID": results[0].id, "AccessToken": token, message : "You have succesfully logged in"});    
                                    });
                                }
                            });
                        } else {
                            // res.send(401);
                            res.json(401,{
                                        "message":"wrong username or password"
                                    })
                        }
                    }
                })
            });
}
