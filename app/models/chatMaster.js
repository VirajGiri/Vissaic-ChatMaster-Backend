var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const shortid = require('shortid');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var chatmasterSchema = new Schema({
    Date:{ type: Date, default: Date.now },
    currentuserId:Schema.Types.ObjectId,
    inUser:Schema.Types.ObjectId,
    outUser:Schema.Types.ObjectId,
    messege:{ type: String},
    type:{ type: String},
    isVerified:{ type: Boolean, default: false},
    isActive:{ type: Boolean, default: true},
    isDeleted:{ type: Boolean, default: false},
});

chatmasterSchema.plugin(uniqueValidator);


module.exports = mongoose.model('chatmaster', chatmasterSchema);