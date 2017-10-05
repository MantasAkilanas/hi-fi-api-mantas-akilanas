const db = require('../config/sql').connect();
const security = require('../services/security');

module.exports = (app) => {
    app.get('/users', security.isAuthenticated, (req, res) => {
        db.query('SELECT * FROM account', (error, rows) => {
            res.send(rows);
        });
    });
};