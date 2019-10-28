let jwt = require('jsonwebtoken');
let config = require('../config');
let crypto = require('crypto-js');
 
module.exports = {
    authorizeManager: function (req, res, next) {
       
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
                if (token) {
                    jwt.verify(token, config.jwt.jwtSecret, (err, decoded) => {
                        if (err) {
                            return res.json({
                                success: false,
                                message: 'Failed to authenticated token.'
                            });
                        } else {
                            if(decoded.role === Number(config.UsersTypes.MANAGER)){
                                req.decoded = decoded;
                                next();
                            }else{
                                return res.json({
                                    success: false,
                                    message: 'Failed to authenticated operations'
                                });
                            }
                           
                        }
                    });
                }
            }
        } else {
            return res.status(403).send({
                success: false,
                message: 'Manager Operation::Unauthorized'
            });
        }
    },
    authorizeBiker: function (req, res, next) {
       
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
                if (token) {
                    jwt.verify(token, config.jwt.jwtSecret, (err, decoded) => {
                        if (err) {
                            return res.json({
                                success: false,
                                message: 'Failed to authenticated token.'
                            });
                        } else {
                            if(decoded.role === Number(config.UsersTypes.BIKER)){
                                req.decoded = decoded;
                                next();
                            }else{
                                return res.json({
                                    success: false,
                                    message: 'Failed to authenticated operations'
                                });
                            }
                           
                        }
                    });
                }
            }
        } else {
            return res.status(403).send({
                success: false,
                message: 'Biker Operation::Unauthorized'
            });
        }
    },
    generateJWT: function (user, type) {
        let token;
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7)
        switch (type) {
            case 1:
                token = jwt.sign({
                    user: user, 
                    role: type,
                    exp: parseInt(expiryDate.getTime() / 1000)
                }, config.jwt.jwtSecret);
                break;
            case 2:
                token = jwt.sign({
                    user: user,
                    role: type,
                    exp: parseInt(expiryDate.getTime() / 1000)
                }, config.jwt.jwtSecret);
                break;
        }
        return token;
    },
    setPassword: function (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        return crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    },
    validPassword: function (password, salt, hash) {
        var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
        return _hash === hash;

    },
    encrypt: function (str) {
        key = crypto.lib.WordArray.create('super-secret-key');
        iv = crypto.lib.WordArray.create('just-a-key');
        var enc = crypto.AES.encrypt(str, key, {
            iv: iv
        }).toString();
        // let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        // let encrypted = cipher.update(str);
        // encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            encryptedData: enc
        };

    }
}