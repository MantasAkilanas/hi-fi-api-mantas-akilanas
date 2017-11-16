const mysql = require("mysql2");
const security = require('../services/security');
const connection = mysql.createConnection({
    "user": "root",
    "host": "localhost",
    "database": "hifi"
});
module.exports = (server) => {
    server.get('/kategorier', (req, res) => {
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
    server.post('/createKategori',security.isAuthenticated, (req, res) => {
        let values = [];
        values.push(req.body.navn);
        values.push(req.body.id);
        values.push(req.body.id2);
        console.log(values);
        connection.query('select navn, id, visible  from kategori where navn = ? or id = ? or id = ?', values, (err, rows) => {
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
                    connection.execute('insert into kategori(navn) values (?)', [req.body.navn], (err, rows) => {
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
                        connection.execute('update kategori set visible = 1 where id = ? ', [rows[0].id], (err, rows) => {
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
                        connection.execute('update kategori set navn = ?, id = ? where id = ? ', values, (err, rows) => {
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
    server.put('/deleteKategori',security.isAuthenticated, (req, res) => {
        let values = [];
        values.push(req.body.id);
        console.log(values);
        connection.execute('update kategori set visible = 0 where id = ? ', [req.body.id], (err, rows) => {
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
    server.del('/deletePermaKategori',security.isAuthenticated, (req, res) => {
        let values = [];
        values.push(req.body.id);
        console.log(values);
        connection.execute('delete from kategori where id = ? ', [req.body.id], (err, rows) => {
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
     server.get('/kategori', (req, res) => {
        const query = `select navn, id
        from kategori where visible = 1`;
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
    server.get('/kategori/:id', (req, res) => {
        //const r = req.params.id
        const query = `select *
        from kategori where
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