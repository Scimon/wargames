var mysql = require('db-mysql');
new mysql.Database({
    hostname: 'localhost',
    user: 'wargames',
    password: 'ed34CV%^',
    database: 'wargames_dev'
}).connect(function(error) {
    if (error) {
        return console.log("CONNECTION ERROR: " + error);
    }

    this.query().select('*').from('hexmap').execute(function(error, rows) {
        if (error) {
            return console.log('ERROR: ' + error);
        }
        console.log(rows.length + ' ROWS');
    });
});