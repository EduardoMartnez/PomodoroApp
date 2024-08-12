const crypto = require('crypto');

module.exports = class {
  
  #password;
  #salt; 

  constructor(data) {
    this.id = data.user_id;
    this.username = data.username;
    this.#password = data.password;
    this.#salt = data.salt;
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
          reject("Error: " +err);
        }

        const digest = derivedKey.toString('hex');
        // console.log("SALT USED: " + this.#salt);
        // console.log("POTENTIALPASSWORD: " + digest);
        // console.log("REALPASSWORD: " + this.#password);

        if (this.#password == digest) {
          resolve(this);
        } else {
          reject("Invalid username or password");
        }
      });
    });
  }
};
