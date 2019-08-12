var mongoose = require('mongoose');


var courseSchema = mongoose.Schema(
    {
        title: {type: String, required: true},
        code: {type: String, required: true},
        creditLoad: {type: Number, required: true},
        semister: {type: String, required: true},
        level: {type: Number, required: true},
        department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
        createdOn: {type: Date, default: Date.now},
        lecturers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer'}],

    }
)

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;