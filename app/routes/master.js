var User = require('../models/users');
var Sticky = require('../models/sticky_notes');
var logTime = require('../models/logInOutSession');
var config = require('../../config/config');
var jsonwebtoken = require('jsonwebtoken');
var chatmaster = require('../models/chatMaster');
var mailController = require('../controllers/mailController');
const shortid = require('shortid');
var secretKey = config.secretKey;
var upload = require('express-fileupload');
var fs = require("fs");
var json2xls = require('json2xls');
const { ObjectID } = require('mongodb');

function createToken(user) {
    var token = jsonwebtoken.sign({
        _id: user._id,
        username: user.username
    }, secretKey, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
    return token;
}

module.exports = function (app, express) {

    var api = express.Router();
    console.log("Master called");
    api.post('/add_messege', function (req, res) {

        console.log("req.body",req.body);
        var chat = new chatmaster({
            currentuserId:req.body.currentuserId,
            inUser:req.body.inUser,
            outUser:req.body.outUser,
            messege:req.body.messege,
            type:req.body.type,
        });
        chat.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "messege has been sent"
            });
        });

    });
    api.post('/get_messeges_by_userid', function (req, res) {
        console.log("req.body.currentuserId",req.body.currentuserId);
        chatmaster.find({currentuserId: ObjectID(req.body.currentuserId)}).exec(function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(data);
        });
    });

    api.post('/add_user', function (req, res) {

        console.log("req.body",req.body);
        var username = req.body.username || req.body.Email;
        var user = new User({
            Name: req.body.Name,
            Email: req.body.Email,
            Role: req.body.Role,
            username: username,
            password: req.body.Password,
            AssignEnquiry: req.body.AssignEnquiry,
            CompletedEnquiry: req.body.CompletedEnquiry,
            Address: req.body.Address,
            City:req.body.City,
            State:req.body.State,
            MobileNo: req.body.MobileNo,
            Landmark: req.body.Landmark,
            Zip: req.body.Zip,
            isActive: true,
            created_by: req.body.created_by,
            created_by_id: req.body.created_by_id
        });
        // var token = createToken(user);
        user.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "user has been created"
            });
        });

    });
    api.post('/login', function (req, res) {
        console.log("H  ", req);
        User.findOne({
            username: req.body.username
        }).select('Name Role username password isActive').exec(function (err, user) {
            if (err) {
                res.send(err);
                return;
            }
            if (!user) {
                res.send({message: "user dosent exist"});
            } else if (user) {

                if (user.isActive == true) {

                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.send({message: "Invalid password"});
                    } else {
                        logtime = new logTime({
                            loginTime: Date.now(),
                            loginUserId: user._id,
                            loginUserRole: user.Role,
                            logoutTime: req.body.logoutTime,
                            IPnumber: req.body.IPnumber,
                            userAgent: req.body.userAgent
                        });
                        logtime.save();
                        var token = createToken(user);
                        res.json({
                            data: user,
                            success: true,
                            message: "successfuly login",
                            token: token
                        });
                    }
                }
            }
        });
    });
    api.get('/get_all_users', function (req, res) {
        User.find({isActive:true}).exec(function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(data);
        });
    });
    api.post('/set_password', function (req, res) {
        User.findOne({
            username: req.body.username,
            MobileNo: req.body.MobileNo,

        }).exec(function (err, user) {
            if (err) {
                res.send(err);
                return;
            }
            var newPass = "123456";
            var newPassword = user.encryptPassword(newPass);
            if(req.body.newPassword !== null){
                User.updateOne({ username: req.body.username}, {$set: {password: newPassword}}, function (errpassword) {
                    if (errpassword) {
                        res.send(errpassword);
                        return;
                    }
                    res.json({
                        status: "success",
                        message: "Password Changed successfully"
                    })
                });
            }
        });

    });
    api.post('/logout', function (req, res) {

        logTime.find({}).sort({$natural: -1}).limit(1).select('_id').exec(function (err, data) {
            if (err) {
                res.send(err);
                return;

            } else {
                logTime.updateOne({_id: data[0]._id},
                    {
                        logoutTime: Date.now()
                    },
                    {upsert: true}).exec(function (err3) {
                    if (err3) {
                        res.send(err3);
                        return;
                    }
                    res.json({"success": true});
                });
            }
        });

    });
    api.post('/lastlogin', function (req, res) {

        logTime.find({loginUserId: req.body.UserId}).sort({ $natural: -1 }).limit(2).exec( function (err, result) {
            if (err) {
                next(err);
            } else {
                res.json(result);
            }
        });

    });
    api.use(function (req, res, next) {

        console.log("user just come to our app");

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // console.log("user token",token);
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({success: false, message: "fail to authonticate user"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success: false, message: "No Token provided"});

        }
    });

    api.post('/add_sticky', function (req, res) {
        console.log("req.body",req.body);
    try {
        var sticky = new Sticky({
            userId:req.body.userId,
            lastUpdate:req.body.lastUpdate,
            stickyTitle:req.body.stickyTitle,
            stickySubTitle:req.body.stickySubTitle,
            stickyBody:req.body.stickyBody,
            stickyReminder:req.body.stickyReminder
        });
        sticky.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "sticky note has been created"
            });
           
        });
    } catch (err) {
        console.error("sticky error",err);
    }
    });
    api.get('/get_all_sticky', function (req, res) {
        Sticky.find({isActive:true,isDeleted:false}).exec(function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(data);
        });
    });
    api.post('/delete_sticky_by_id', (req, res) => {

        Sticky.updateOne({ _id: req.body.id }, {$set: { isActive:false,
            isDeleted:true}}, function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "sticky note has been deleted"
            });
        });
        
    })
    api.post('/update_sticky_by_id', (req, res) => {

        Sticky.updateOne({ _id: req.body.id }, {$set: { 
            lastUpdate:req.body.lastUpdate,
            stickyTitle:req.body.stickyTitle,
            stickySubTitle:req.body.stickySubTitle,
            stickyBody:req.body.stickyBody,
            stickyReminder:req.body.stickyReminder}}, function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "sticky note has been updated"
            });
        });
        
      });

     
    

  



    return api;
}