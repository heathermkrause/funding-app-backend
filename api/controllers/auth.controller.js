const passport = require('passport');
const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
//const nodemailer = require("nodemailer");
//const sgMail = require('@sendgrid/mail');
//const mg = require('nodemailer-mailgun-transport');
var helper = require('sendgrid').mail;

const config = require('../../config');
const APIError = require('../utils/api-error');
const { exists } = require('../models/user.model');

const User = mongoose.model('User');


//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
// // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
// const auth = {
//   auth: {
//     api_key: '87c34c41-9134b8ac',
//     domain: 'sandboxa3ac099bc12940a69d41b1919e6f8ec0.mailgun.org'
//   },
// }
 
// const nodemailerMailgun = nodemailer.createTransport(mg(auth));

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const exitingUser = await User.findOne({ email }).lean();

      if (exitingUser) {
        throw new APIError('The user with this email already exits!', 400);
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName
      });

      User.register(user, password, err => {
        if (err) {
          err.status = 400;
          return next(err);
        }

        res
          .status(201)
          .send({ success: true })
          .end();
      });
    } catch (error) {
      next(error);
    }
  }

  login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new APIError('Email or password can not be empty', 401));
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.error(info);
        return next(err || new APIError('Email or password is wrong', 401));
      }

      req.login(user, { session: false }, err1 => {
        if (err1) {
          return next(err1);
        }

        const token = jwt.sign(user.toSafeJSON(), config.jwtSecret, {
          expiresIn: config.jwtExpiresIn
        });

        return res.json({
          user: user.toSafeJSON(),
          token
        });
      });
    })(req, res);
  }

  async forgotpassword(req, res, next) {
    try {
      const { email } = req.body;
      const exitingUser = await User.findOne({ email }).lean();

      if (!exitingUser) {
        throw new APIError('The user with this email doesn\'t exit!', 400);
      }

      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      //let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      // let transporter = nodemailer.createTransport({
      //   host: "smtp.sendgrid.net",
      //   port: 587,
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: process.env.MAIL_USERNAME, // generated ethereal user
      //     pass: process.env.MAIL_PASSWORD // generated ethereal password
      //   },
      // });

      const token = jwt.sign({id: exitingUser._id, email: email}, config.jwtSecret, {
        expiresIn: '1d'
      });

      

      // send mail with defined transport object
      // let info = await transporter.sendMail({
      //   from: process.env.MAIL_FROM_ADDRESS, // sender address
      //   to: email, // list of receivers
      //   subject: "Password Reset", // Subject line
      //   text: "Hi Bernie,\n\n Did you request to reset your password? If you did, click the button below and reset! If you didn't send in the request, just ignore this email.\n\n\n<a target='_blank' href='localhost:3000/auth/reset-password?token=" + token + "&email=" + email + "'>Reset Password</a>", // plain text body
      //   html: "<b>Hi Bernie,</b><br/><br/>Did you request to reset your password? If you did, click the button below and reset! If you didn't send in the request, just ignore this email.<br/><br/><br/><a target='_blank' href='localhost:3000/auth/reset-password?token=" + token + "&email=" + email + "'>Reset Password</a>", // html body
      // });

      let text = "<b>Hi Bernie,</b><br/><br/>Did you request to reset your password? If you did, click the button below and reset! If you didn't send in the request, just ignore this email.<br/><br/><br/><a href='" + process.env.DOMAIN_NAME + "/auth/reset-password?token=" + token + "&email=" + email + "'>Reset Password</a>";

      var from_email = new helper.Email(process.env.MAIL_FROM_ADDRESS);
      var to_email = new helper.Email(email);
      var subject = 'Onboard';
      var content = new helper.Content('text/html', text);
      var mail = new helper.Mail(from_email, subject, to_email, content);


      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
      });

      sg.API(request, function(error, response) {
          console.log(response.statusCode);
          console.log(response.body);
          console.log(response.headers);
      });
      
      //console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res
      .status(200)
      .send({ success: true })
      .end();
    } catch (error) {
      next(error);
    }
  }

  async resetpassword(req, res, next) {
    try {
      const { email, password, token } = req.body;
      

      var decoded = jwt.verify(token, config.jwtSecret);

      console.log('email', email, password, token, decoded);

      
      const exitingUser = await User.findById(decoded.id)

      if (!exitingUser) {
        throw new APIError('The user doesn\'t exit!', 400);
      }

      console.log(exitingUser);

      await exitingUser.setPassword(password);

      await exitingUser.save();

      //await exitingUser.setPassword(password);
      res
      .status(200)
      .send({ success: true })
      .end();
    } catch (error) {
      res.status(401).json({ message: 'You are a malformed user' });
      next(error);
    }
  }
}

module.exports = {
  authController: new AuthController()
};
