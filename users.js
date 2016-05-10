var fs = require('fs');

module.exports = {
	
	getUsers: function (callback) {
		fs.readFile('./users.json', function (err, data) {
			var users = data.toString();
			var userArray = JSON.parse(users);
			callback(userArray);
		});
	},
	addUser: function (newUser) {
		fs.readFile ('./users.json', function (err,data) {
			var users = data.toString();
			var userArray = JSON.parse(users);
			userArray.push(newUser);
			fs.writeFile('./users.json', JSON.stringify(userArray));
		});
	}
};