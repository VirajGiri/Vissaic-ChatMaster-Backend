/**
 * Created by viraj on 04/19/2022.
 */
 var mongoose = require('mongoose');
 var bcrypt = require('bcrypt-nodejs');
 const shortid = require('shortid');
 var uniqueValidator = require('mongoose-unique-validator');
 var Schema = mongoose.Schema;
 var stickynotesSchema = new Schema({
    Date:{ type: Date, default: Date.now },
    userId:Schema.Types.ObjectId,
    lastUpdate:{ type: Date, default: Date.now },
    isActive:{ type: Boolean, default: true},
    isDeleted:{ type: Boolean, default: false},
    stickyTitle:{type:String},
    stickySubTitle:{type:String},
    stickyBody:Schema.Types.Mixed,
    stickyReminder:{ type: Date},
    stickyCompleted:{ type: Boolean, default: false}
 })

 stickynotesSchema.plugin(uniqueValidator);


module.exports = mongoose.model('sticky_notes', stickynotesSchema);