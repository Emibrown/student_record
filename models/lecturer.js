var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var lecturerSchema = mongoose.Schema(
    {   
        title: {type: String, required: true},
        staffID: {type: String, required: true, unique: true},
    	firstname: {type: String, required: true},
    	lastname: {type: String, required: true},
    	othername: {type: String, required: true},
        fullname: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        address: {type: String, required: true},
        gender: {type: String, required: true},
        email: {type: String, required: true},
        stateOfOrigin: {type: String, required: true},
        lga: {type: String, required: true},
        department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
        faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'},
        password: {type: String, default: "staff123"},
        Photourl: {type: String, required: true},
        createdAt: {type: Date, default: Date.now},
    }
)


lecturerSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	return jwt.sign({
		_id: this._id,
		staffID: this.staffID,
		exp: parseInt(expiry.getTime() / 1000),
	}, 'thisIsSecret' );
};


var Lecturer = mongoose.model('Lecturer', lecturerSchema);

module.exports = Lecturer;