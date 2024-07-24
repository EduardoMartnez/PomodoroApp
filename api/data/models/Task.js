module.exports = class {
  constructor(data) {
    this.id = data.task_id;
    this.name = data.task_name;
    this.date = data.task_date;
    this.des = data.task_des;
  }
};
