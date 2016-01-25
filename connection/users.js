var pg = require('pg');
var conString = "postgres://postgres:root@localhost/Test";
var pgClient = new pg.Client(conString);

//this initializes a connection pool
pgClient.connect(function(err, client, done) {
  if (err) {
    console.log("pg Error",err)
  }
  else {
    console.log("pg success");
  }
});

module.exports = pgClient;