const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const security = require('../services/security');
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
        //const r = req.params.id
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
        connection.query(query, [req.params.id, req.params.id, req.params.id, req.params.id], (err, results) => {
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
    server.get('/alleprodukter', (req, res) => {
        const query = `select produkter.*, kategori.navn as kategori, kategori.id as kateogoriid, producent.navn as producent, producent.id as producentid
        from produkter
        inner join kategori
            on fk_kategori = kategori.id
        inner join producent
            on fk_producent = producent.id
            where produkter.visible = 1 `;
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
    server.post('/createProdukt',security.isAuthenticated, (req, res) => {
        // let values = [];
        // values.push(req.body.navn);
        // values.push(req.body.id);
        // values.push(req.body.id2);
        // console.log(values);
        // console.log(req.body.kategori);
        // console.log(req.body.producent);
        console.log(req.body.oldpicture);
        connection.query('select navn, id, visible from produkter where navn = ? or id = ? or id = ?', [req.body.navn, req.body.id, req.body.id2], (err, rows) => {
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
                    connection.execute('insert into produkter(navn,fk_kategori,fk_producent,pris,antal,billede) values (?,?,?,?,?,?)', [req.body.navn, req.body.kategori, req.body.producent, req.body.pris, req.body.antal, req.files.picture.name], (err, rows) => {
                        if (err) {
                            console.log(err);
                            res.json(500, {
                                "message": "Internal Server Error",
                                "error": err
                            })
                        }
                        else {
                            if (req.files.picture.name != '') {
                                // gem det nye nan
                                image = req.files.picture.name;
                                // flyt den uploadede midlertidige fil til billede mappen 
                                var temp_image = fs.createReadStream('./' + req.files.picture.path); // input stream
                                var final_image = fs.createWriteStream('./public/assets/media/' + image); // output stream
                                temp_image.pipe(final_image);
                                temp_image.on('end', function () {
                                    // slet den midlertidige fil, når "final_image" er oprettet  
                                    fs.unlink('./' + req.files.picture.path);
                                })
                            }
                            res.json(200, {

                                "message": "succes"
                            })
                        }
                    })
                }
                else {
                    if (rows[0].visible == 0) {
                        connection.execute('update produkter set visible = 1 where id = ? ', [rows[0].id], (err, rows) => {
                            if (err) {
                                res.json(500, {
                                    "message": "Internal Server Error",
                                    "error": err
                                })
                            }
                            else {
                                res.json(200, {

                                    "message": "succes"
                                })
                            }
                        })
                    }
                    else {
                        connection.execute('update produkter set navn = ?, id = ?, fk_kategori =?, fk_producent =?, pris =?, antal=?,billede = ?  where id = ? ', [req.body.navn, req.body.id, req.body.kategori, req.body.producent, req.body.pris, req.body.antal, req.files.picture.name, req.body.id2], (err, rows) => {
                            if (err) {
                                res.json(500, {
                                    "message": "Internal Server Error",
                                    "error": err
                                })
                            }
                            else {
                                console.log('./public/assets/media/' + req.body.oldpicture);
                                if (req.body.oldpicture != req.files.picture.name) {
                                    if (fs.existsSync('./public/assets/media/' + req.body.oldpicture)) {
                                        fs.unlinkSync('./public/assets/media/' + req.body.oldpicture);
                                    }
                                    if (req.files.picture.name != '') {
                                        // gem det nye nan
                                        image = req.files.picture.name;
                                        // flyt den uploadede midlertidige fil til billede mappen 
                                        var temp_image = fs.createReadStream('./' + req.files.picture.path); // input stream
                                        var final_image = fs.createWriteStream('./public/assets/media/' + image); // output stream
                                        temp_image.pipe(final_image);
                                        temp_image.on('end', function () {
                                            // slet den midlertidige fil, når "final_image" er oprettet  
                                            fs.unlink('./' + req.files.picture.path);
                                        })
                                    }
                                }
                                res.json(200, {

                                    "message": "succes"
                                })
                            }
                        })
                    }
                }
            }
        })

    });
    server.put('/deleteProdukt',security.isAuthenticated, (req, res) => {
        let values = [];
        values.push(req.body.id);
        console.log(values);
        connection.execute('update produkter set visible = 0 where id = ? ', [req.body.id], (err, rows) => {
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
    server.put('/deletePermaProdukt',security.isAuthenticated, (req, res) => {
        connection.query("select billede from produkter where id = ?", [req.body.id], (err, billede) => {
            if (err) {
                console.log(err);
            }
            else {
                connection.execute('delete from produkter where id = ? ', [req.body.id], (err, rows) => {
                    if (err) {
                        res.json(500, {
                            "message": "Internal Server Error",
                            "error": err
                        })
                    }
                    else {
                        if (fs.existsSync('./public/assets/media/' + billede[0].billede)) {
                            fs.unlinkSync('./public/assets/media/' + billede[0].billede);
                        }
                        res.json(200, {

                            "message": "Data deleted"
                        })
                    }
                })
            }

        })
    })
};