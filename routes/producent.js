const mysql = require("mysql2");
const security = require('../services/security');
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    // server.get('/producent', (req, res) => {
    //     const query = `select navn, id 
    //     from producent`;
    //     connection.query(query, (err, results) => {
    //         if (err) {
    //             res.status(500);
    //             res.end;
    //         }
    //         else {
    //             res.setHeader('Access-Control-Allow-Origin', "*");
    //             res.send(results);
    //         }
    //     });
    // })
    server.post('/createProducent',security.isAuthenticated, (req, res) => {
        let values = [];
        values.push(req.body.navn);
        values.push(req.body.id);
        values.push(req.body.id2);
        console.log(values);
        connection.query('select navn, id, visible  from producent where navn = ? or id = ? or id = ?', values, (err, rows) => {
            if (err) {
                console.log(err);
                res.json(500, {
                    "message": "Internal Server Error",
                    "error": err
                })
            }
            else {
                console.log(rows.length)
                if (rows.length == 0) {
                    connection.execute('insert into producent(navn) values (?)', [req.body.navn], (err, rows) => {
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
                }
                else {
                    if (rows[0].visible == 0) {
                        connection.execute('update producent set visible = 1 where id = ? ', [rows[0].id], (err, rows) => {
                            if (err) {
                                res.json(500, {
                                    "message": "Internal Server Error",
                                    "error": err
                                })
                            }
                            else {
                                res.json(200, {
                
                                    "message": "Data is visible again"
                                })
                            }
                        })
                    }
                    else {
                        connection.execute('update producent set navn = ?, id = ? where id = ? ', values, (err, rows) => {
                            if (err) {
                                res.json(500, {
                                    "message": "Internal Server Error",
                                    "error": err
                                })
                            }
                            else {
                                res.json(200, {
                
                                    "message": "Data updated"
                                })
                            }
                        })
                    }
                }
            }
        })

    });
    server.put('/deleteProducent',security.isAuthenticated, (req, res) => {
        let values = [];
        values.push(req.body.id);
        console.log(values);
        connection.execute('update producent set visible = 0 where id = ? ', [req.body.id], (err, rows) => {
            if (err) {
                res.json(500, {
                    "message": "Internal Server Error",
                    "error": err
                })
            }
            else {
                res.json(200, {

                    "message": "Data hidden"
                })
            }
        })
    })
    server.put('/deletePermaProducent', security.isAuthenticated,(req, res) => {
        let values = [];
        values.push(req.body.id);
        console.log(values);
        connection.execute('delete from producent where id = ? ', [req.body.id], (err, rows) => {
            if (err) {
                res.json(500, {
                    "message": "Internal Server Error",
                    "error": err
                })
            }
            else {
                res.json(200, {

                    "message": "Data deleted"
                })
            }
        })
    })
     server.get('/producent', (req, res) => {
        const query = `select navn, id
        from producent where visible = 1`;
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
    server.get('/producent/:id', (req, res) => {
        //const r = req.params.id
        const query = `select *
        from producent where
            navn like "%"?"%"
            or id like "%"?"%"
            `;
        connection.query(query,[req.params.id,req.params.id], (err, results) => {
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
}