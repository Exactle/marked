/**
 * Created by AlexAitken on 9/27/2015.
 * TODO: Implement group sharing w/ access code
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local      : {
        email  : String,
        password : String,
        people : []
    }
});

//hash hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

};

//password is u right
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

//create model
module.exports = mongoose.model('User', userSchema);