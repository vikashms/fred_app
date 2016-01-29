var Sequelize = require('sequelize'); // it is a ORM to crealte relational object model
var sequelize = new Sequelize("postgres://postgres:root@localhost/Test"); // creating a connection with postgres server

console.log("postgress connecction has been created");


module.exports = {
  sequelize:sequelize,
  Sequelize:Sequelize
}