/**
 * Created by viraj on 3/13/2019.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    Name:{type:String, require:false},
    Role:{
        type: String,
        require:true,
        enum: ["counsellor", "guest", "admin","superadmin","accmanager"]
    },
    Email:{type:String, require:false},
    AssignEnquiry:{type:Number, require:false},
    CompletedEnquiry:{type:Number, require:false},
    Address:{type:String},
    City:{type:String},
    State:{type:String},
    MobileNo:{type:String},
    Landmark:{type:String},
    Zip:{type:Number},
    username:{type:String, require:true, index:{unique:true}},
    password:{type:String, require:true, select:false},
    isActive:{type:Boolean},
    created_by:{type:String},
    created_by_id: Schema.Types.ObjectId
});


UserSchema.pre('save', function(next){
    var user = this;
    console.log("user",user);

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) {
            throw err;
            return next("I am in err",err);
        }

        user.password = hash;
        next();
    });

});
UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
UserSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
