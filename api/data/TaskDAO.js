const db = require('./DBConnection');
const Task = require('./models/Task');

function getTasks() {
  return db.query('SELECT * FROM task').then(({results}) => {
    console.log(results);
    return results.map(task => new Task(task)); ;
  });
}

function getTaskById(taskId) {
  return db.query('SELECT * FROM task WHERE task_id=?', [taskId]).then(({results}) => {
    if(results[0])
      return new Task(results[0]);
  });
}

//remove task
function deleteTask(task){
  return db.query('DELETE FROM task WHERE task_id=?', [task.id]).then(({results}) => {
    if(results[0])
      return new Task(results[0]);
  });
}

//edit task
function editTask(taskId, newTask){
  return db.query('UPDATE task SET ? WHERE task_id = ?', [{ task_name: newTask.name, task_date: newTask.date, task_des: newTask.des }, taskId]).then(({results}) => {
    return getTaskById(taskId);
  });
}



module.exports = {
  getTasks: getTasks,
  getTaskById: getTaskById,
  deleteTask: deleteTask,
  editTask: editTask
};