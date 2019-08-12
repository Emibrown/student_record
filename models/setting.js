var mongoose = require('mongoose');



var settingSchema = mongoose.Schema(
    {
        type: {type: String, default: 'session'},
    	currentSession: {type: mongoose.Schema.Types.ObjectId, ref: 'Session'},
        currentSemister: {type: String},
    }
)


var Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;