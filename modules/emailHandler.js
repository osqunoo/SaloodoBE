var nodemailer = require('nodemailer');
var config = require('../config');
var baseDAO = require('../dal/base');
var errorHandler = require('../modules/errorHandler');

module.exports = {
    sendEmail: function (to, subject, body, done) {
        let smptTransport = nodemailer.createTransport(config.emailConfig);
        var mailOptions = {
            to: to,
            from: config.emailConfig.auth.user,
            subject: subject,
            html: body
        };
        smptTransport.sendMail(mailOptions, function (err) {
            if (err) {
                console.log(err);
                done(err, null);
            } else {
                console.log('email sent');
                done(null, 'sent');
            }
        });
    },
    sendEmailFromDb: function (to, subject, body, done) {
        let procInfo = require('../sqlProcedures/registration/REG_SEND_EMAIL');
        procInfo.parameters.PI_TO.val = to;
        procInfo.parameters.PI_SUBJECT.val = subject;
        procInfo.parameters.PI_BODY.val = body;
        baseDAO.execProc(procInfo, function (err, result) {
            if (err) {
                done(err, null);
            }
            done(null, result);
        })
    }
}