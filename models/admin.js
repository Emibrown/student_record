var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var adminSchema = mongoose.Schema(
    {
    	firstName: {type: String, required: true},
    	lastName: {type: String, required: true},
    	otherName: {type: String, required: true},
        fullname: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
    }
)


adminSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	return jwt.sign({
		_id: this._id,
		email: this.email,
		exp: parseInt(expiry.getTime() / 1000),
	}, 'thisIsSecret' );
};



var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;