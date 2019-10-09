var Sequelize = require('sequelize');
// export NODE_ENV=development
var bcrypt = require('bcryptjs');
const database = require('../server/config/database');
var conString = database.conString;


// create a sequelize instance with our local postgres database information.
const sequelize = new Sequelize(conString, {
  dialect: 'postgres'
});
// var sequelize = new Sequelize({
//     connectionString: conString,
// }); 

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
},  {
  hooks: {
    beforeCreate: (user) => {
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(user.password, salt);
    }
  }
});


// User.prototype.beforeCreate = async function(user) {
//   const salt = await bcrypt.genSalt(10); //whatever number you want
//   user.password = await bcrypt.hash(user.password, salt);
// }
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}
User.prototype.roles = async function() {
  return await this.role;
}

// User.beforeCreate = (user) => {
//   const salt = bcrypt.genSaltSync();
//   user.password = bcrypt.hashSync(user.password, salt);
// }

// User.validPassword = (password) => {
//   return bcrypt.CompareSync(password, this.password);
// }

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;