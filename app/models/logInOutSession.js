/**
 * Created by viraj on 21/05/2019.
 */
var mongoose = require('mongoose');
const shortid = require('shortid');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var logInOutSchema = new Schema({
    loginTime:{type: Date},
    loginUserId:Schema.Types.ObjectId,
    loginUserRole:{type:String, require:true},
    logoutTime:{type: Date},
    IPnumber:{type:String},
    userAgent:{type:String}

});
logInOutSchema.plugin(uniqueValidator);


module.exports = mongoose.model('logInOut', logInOutSchema);