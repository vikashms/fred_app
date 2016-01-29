var User = null;
var db = require("../../connection/db"),
    sql = db.sequelize,
    Sequelize = db.Sequelize,
    passportLocalSequelize = require('passport-local-sequelize');


// Define User schema

User = sql.define("User",{
  name:Sequelize.STRING,
  email:Sequelize.STRING,
  mobile:Sequelize.STRING,
  password:Sequelize.STRING
});

/*passportLocalSequelize.attachToUser(User, {
  usernameField: 'email',
  passwordField: 'password'
});*/

module.exports = User;