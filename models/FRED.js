/**
 * Created by vikashs on 27-01-2016.
 */

var db = require("../connection/db"),
    sql = db.sequelize,
    Sequelize = db.Sequelize,
    passportLocalSequelize = require('passport-local-sequelize');


var Friendly = sql.define("Friendly",{
    nominator:Sequelize.STRING,
    nominated:Sequelize.STRING
});

var Resourceful = sql.define("Resourceful",{
    nominator:Sequelize.STRING,
    nominated:Sequelize.STRING
});

var Enthusiastic = sql.define("Enthusiastic",{
    nominator:Sequelize.STRING,
    nominated:Sequelize.STRING
});

var Dependable = sql.define("Dependable",{
    nominator:Sequelize.STRING,
    nominated:Sequelize.STRING
});
sql.sync();
module.exports = {
    F:Friendly,
    R:Resourceful,
    E:Enthusiastic,
    D:Dependable
};