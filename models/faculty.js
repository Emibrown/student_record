var mongoose = require('mongoose');


var facultySchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        createdOn: {type: Date, default: Date.now},
    }
)

var Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;