var mongoose = require('mongoose');


var regcourseSchema = mongoose.Schema(
    {
        session:{type: mongoose.Schema.Types.ObjectId, ref: 'Session'},
        student:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        semister: {type: String, required: true},
        level: {type: Number, required: true},
        courses:[
            {
                courseID: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
                assessment:{type: Number},
                exam:{type: Number},
                status: {type: String, default: "Not approved"},
            }
        ]
    }
)

var Regcourse = mongoose.model('Regcourse', regcourseSchema);

module.exports = Regcourse;