var Sequelize = require('sequelize');
// export NODE_ENV=development
const database = require('../server/config/database');
var conString = database.conString;


// create a sequelize instance with our local postgres database information.
const sequelize = new Sequelize(conString, {
  dialect: 'postgres'
});

// setup formchecks table and its fields.
var formchecks = sequelize.define('formchecks', {
    rno: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    term7: {
        type: Sequelize.STRING,
        defaultValue: 'true',
        allowNull: false
    },
    oral7: {
        type: Sequelize.STRING,
        defaultValue: 'false',
        allowNull: false
    },
    term8: {
        type: Sequelize.STRING,
        defaultValue: 'false',
        allowNull: false
    },
    oral8: {
        type: Sequelize.STRING,
        defaultValue: 'false',
        allowNull: false
    },
    finalterm: {
        type: Sequelize.STRING,
        defaultValue: 'false',
        allowNull: false
    },
    finaloral: {
        type: Sequelize.STRING,
        defaultValue: 'false',
        allowNull: false
    },
    mentor_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('formchecks table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = formchecks;
// module.exports = {
//     formchecks,
//     t7form
// }