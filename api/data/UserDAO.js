const db = require('./DBConnection');
const User = require('./models/User');
const Settings = require('./models/Settings');
const crypto = require('crypto');
const { resolve } = require('path');

async function loginUser(username, password) {
  const { results } = await db.query('SELECT * FROM User WHERE username = ?', [username]);
  const user = new User(results[0]);
  // console.log('user: ' + user.username);
  if (user) { // we found our user
    // console.log('good');
    return user.validatePassword(password);

  }
  else { // if no user with provided username
    throw new Error("No such user");
  }
}

async function getUsers() {
  const { results } = await db.query('SELECT * FROM User');
  return results.map(user => new User(user));
}

async function getUserById(user_id) {
  const { results } = await db.query('SELECT * FROM User WHERE user_id = ?', [user_id]);
  if (results[0])
    return new User(results[0]);
}

/**
 * Creates a new account and returns an array that contains the new User and Settings represented in the database
 * 
 * @param {*} user 
 * @returns 
 */
async function createUser(user){
  const { results } = await db.query('INSERT INTO User (username, password, salt) VALUES (?, ?, ?)', [user.username, user.password, user.salt]);
  return results.insertId;
}

/**
 * Add new settings for a recently created account. Contains default values for settings.
 * 
 * @param {*} user_id 
 * @returns 
 */
async function createUserSettings(user_id){
  const { results } = await db.query('INSERT INTO Settings (user_id, work_time, break_time, long_time, current_cycle, active, work_count) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_id, 1500, 300, 1200, 0, false, 0]);
  return;
}

/*
function editUser(user_id, newUser){
  return db.query('UPDATE task SET ? WHERE user_id = ?', [{ first_name: newUser.firstname, last_name: newUser.lastname, username: newUser.username, password: newUser.password, usr_salt: newUser.salt }, taskId]).then(({results}) => {
    return getUserById(taskId);
  });
}
*/

async function getUserSettings(user_id){
  const { results } = await db.query('SELECT * FROM Settings WHERE user_id = ?', [user_id]);
  //return results.map(settings => new Settings(settings));
  if (results[0]) {
    console.log(results[0]);
    return new Settings(results[0]);
  }
}

async function updateUserSettings(new_settings, user_id){
  const { results } = await db.query('UPDATE Settings SET work_time = ?, break_time = ?, long_time = ?, current_cycle = ?, active = ?, work_count = ? WHERE user_id = ?',
    [new_settings.work_time, new_settings.break_time, new_settings.long_time, new_settings.current_cycle, new_settings.active, new_settings.work_count, user_id]);
  //return results.map(settings => new Settings(settings));
  if (results[0]) {
    console.log(results[0]);
    return new Settings(results[0]);
  }
}


module.exports = {
  loginUser: loginUser,
  getUsers: getUsers,
  getUserById: getUserById,
  createUser: createUser,
  // editUser: editUser,
  getUserSettings: getUserSettings,
  createUserSettings: createUserSettings,
  updateUserSettings: updateUserSettings
};