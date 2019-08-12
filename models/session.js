var mongoose = require('mongoose');



var sessionSchema = mongoose.Schema(
    {
        year:{type: Number, required: true},
    	title: {type: String, required: true},
        startDate: {type: Date, required: true},
        endDate:{type: Date, required: true}
    }
)


var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;