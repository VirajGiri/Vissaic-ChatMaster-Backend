/**
 * Created by viraj on 22/12/2021.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const shortid = require('shortid');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mobileInsuranceSchema = new Schema({
    Date:{ type: Date, default: Date.now },
    userId:Schema.Types.ObjectId,
    mailId:{type:String},
    username:{type:String},
    password:{type:String},
    uniqueId:{type:String, unique: true},
    fullName:{type:String},
    firstName:{type:String},
    middleName:{type:String},
    lastName:{type:String},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    zip:{type:String},
    country:{type:String},
    contactOne:{type:Number},
    contactTwo:{type:Number},
    aadhaarNumber:{type:Number},
    panNumber:{type:String},
    passportNumber:{type:String},
    mobileDetails:Schema.Types.Mixed,
    aadhaar_pic_front:Schema.Types.Mixed,
    aadhaar_pic_back:Schema.Types.Mixed,
    mobile_photo_front:Schema.Types.Mixed,
    mobile_photo_back:Schema.Types.Mixed,
    paymentDetails:Schema.Types.Mixed,
    createdAt:{ type: Date, default: Date.now },
    expireAt:{ type: Date},
    planFor:{
        type: String,
        require:false,
        enum: ["five-year","three-year","two-year","one-year", "8-month", "6-month","3-month","2-month"]
    },
    isVerified:{ type: Boolean, default: false},
    isActive:{ type: Boolean, default: true},
    isDeleted:{ type: Boolean, default: false},
});

mobileInsuranceSchema.plugin(uniqueValidator);


module.exports = mongoose.model('mobile_insurance', mobileInsuranceSchema);