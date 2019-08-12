var mongoose = require('mongoose');


var departmentSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        duration: {type: Number, required: true},
        faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'Faculty'},
        createdOn: {type: Date, default: Date.now}
    }
)

var Department = mongoose.model('Department', departmentSchema);

module.exports = Department;