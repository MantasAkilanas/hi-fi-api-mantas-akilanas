const db = require('../config/sql').connect();
const passwordHash = require('password-hash');
const crypto = require('crypto');

/**
 * @module Security
 */
module.exports = {
    /**
     * isAuthenticated
     * Checks request header for valid accesstoken and userID.
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @param {function} next - callback function
     */
    'isAuthenticated': (req, res, next) => {
        if (req.header('Authorization') && req.header('userID')) {
            const query = `SELECT id, created
            FROM accesstokens
            WHERE userid = ?
                AND token = ?
            ORDER BY created DESC LIMIT 1`;
            db.execute(query, [req.header('userID'), req.header('Authorization')], (error, rows) => {
                if (error) return res.send(500);
                else if (rows.length === 0) return res.send(401);
                else if (rows.length === 1) {
                    if ((new Date - rows[0].created) > (1000 * 60 * 60)) {
                        db.execute('DELETE FROM accesstokens WHERE id = ?', [rows[0].id], (error) => {
                            return res.send(401);
                        });
                    } else {
                        return next();
                    }
                }
                else return res.send(401);
            });
        } else {
            res.send(401);
        }
    }
};