module.exports = class {
  constructor(data) {
    this.user_id = data.user_id;
    this.work_time = data.work_time;
    this.break_time = data.break_time;
    this.long_time = data.long_time;
    this.current_cycle = data.current_cycle;
    this.active = data.active;
    this.work_count = data.work_count;
  }
};
