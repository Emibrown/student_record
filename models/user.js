var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Department = require('./department');

var userSchema = mongoose.Schema(
    {
    	firstname: {type: String, required: true},
    	surname: {type: String, required: true},
    	othername: {type: String, required: true},
        fullname: {type: String, required: true},
        gender: {type: String, required: true},
        regNo: {type: String, required: true, unique: true},
        email: {type: String, required: true},
        address: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
        faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'},
        yearOfAdmission: {type: Number, required: true},
        level: {type: Number, required: true},
        dateOfBirth: {type: Date, required: true},
        stateOfOrigin: {type: String, required: true},
        lga: {type: String, required: true},
        password: {type: String, default: "12345678"},
        Photourl: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
    }
)


userSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	return jwt.sign({
		_id: this._id,
		regNo: this.regNo,
		exp: parseInt(expiry.getTime() / 1000),
	}, 'thisIsSecret' );
};



var User = mongoose.model('User', userSchema);

module.exports = User;