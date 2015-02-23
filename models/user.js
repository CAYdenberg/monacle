var mongoose = require('mongoose');

User = mongoose.model('User', {
	email: String,
	password: String
});

module.exports = User;