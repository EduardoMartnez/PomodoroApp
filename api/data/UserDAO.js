const db = require('./DBConnection');
const User = require('./models/User');
const Settings = require('./models/Settings');
const crypto = require('crypto');
const { resolve } = require('path');

function userLogin(username, password) {
  return db.query('SELECT * FROM user WHERE username=?', [username]).then(({results}) => {
    const user = new User(results[0]);
    console.log('user: ' + user.username);
    if (user) { // we found our user
      console.log('good');
      return user.validatePassword(password);
      
      // crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, derivedKey) => {
      //   if (err) { //problem computing digest, like hash function not available
      //     console.log("bad");
      //    reject("Error: " +err);
      //   }

      //   console.log('good hashing');

      //   const digest = derivedKey.toString('hex');

      //   if (user.password == digest) {
      //     resolve(user);
      //   }
      //   else {
      //     reject("Invalid username or password");
      //   }
      // });
    }
    else { // if no user with provided username
      throw new Error("No such user");
    }
  });
}

function getUsers() {
  return db.query('SELECT * FROM user').then(({results}) => {
    return results.map(user => new User(user));
  });
}

function getUserById(userId) {
  return db.query('SELECT * FROM user WHERE user_id=?', [userId]).then(({results}) => {
    if(results[0])
      return new User(results[0]);
  });
}

function createUser(user){
  return db.query('INSERT INTO user (first_name, last_name, username, password, usr_salt) VALUES (?, ?, ?, ?, ?)',
    [user.first_name, user.last_name, user.username, user.password, user.salt]).then(({results}) => {
      return getUserById(results.insertId);
  });
}


function addUserSettings(userID){
  return db.query('INSERT INTO user_settings (uvs_user_id, language, birthdate, taskNotif, groupNotif) VALUES (?, ?, ?, ?, ?)',
    [userID, "English", "null", false, false]).then(({results}) => {
      return;
  });
}

function editUser(userId, newUser){
  return db.query('UPDATE task SET ? WHERE user_id = ?', [{ first_name: newUser.firstname, last_name: newUser.lastname, username: newUser.username, password: newUser.password, usr_salt: newUser.salt }, taskId]).then(({results}) => {
    return getUserById(taskId);
  });
}

function getUserSettings(userId){
  return db.query('SELECT * FROM user_settings WHERE uvs_user_id = ?', [userId]).then(({results}) => {
    //return results.map(settings => new Settings(settings));
    if(results[0]) {
      console.log(results[0]);
      return new Settings(results[0]);
    }
  });
}

function updateUserSettings(userSettings, userId){
  return db.query('UPDATE user_settings SET language = ?, birthdate = ?, taskNotif = ?, groupNotif = ? WHERE uvs_user_id = ?', 
  [userSettings.userLanguage, userSettings.userBirthdate, userSettings.userTaskNotif, userSettings.userGroupNotif, userId]).then(({results}) => {
    //return results.map(settings => new Settings(settings));
    if(results[0]){
      console.log(results[0]);
      return new Settings(results[0]);
    }
  });
}


module.exports = {
  userLogin: userLogin,
  getUsers: getUsers,
  getUserById: getUserById,
  createUser: createUser,
  addUserToGroup: addUserToGroup,
  deleteUserFromGroup: deleteUserFromGroup,
  editUser: editUser,
  getUserSettings: getUserSettings,
  addUserSettings: addUserSettings,
  updateUserSettings: updateUserSettings
};