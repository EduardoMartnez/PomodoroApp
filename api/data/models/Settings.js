module.exports = class {
    constructor(data) {
      this.userId = data.uvs_user_id;
      this.language = data.language;
      this.birthdate = data.birthdate;
      this.taskNotif = data.taskNotif;
      this.groupNotif = data.groupNotif;
    }
  };