const db = require('./DBConnection');
const Task = require('./models/Task');

async function getTasks() {
  const { results } = await db.query('SELECT * FROM task');
  return results.map(task => new Task(task));
  ;
}

async function getTaskById(taskId) {
  const { results } = await db.query('SELECT * FROM task WHERE task_id=?', [taskId]);
  if (results[0])
    return new Task(results[0]);
}

//remove task
async function deleteTask(task){
  const { results } = await db.query('DELETE FROM task WHERE task_id=?', [task.id]);
  if (results[0])
    return new Task(results[0]);
}

//edit task
async function editTask(taskId, newTask){
  const { results } = await db.query('UPDATE task SET ? WHERE task_id = ?', [{ task_name: newTask.name, task_date: newTask.date, task_des: newTask.des }, taskId]);
  return await getTaskById(taskId);
}



module.exports = {
  getTasks: getTasks,
  getTaskById: getTaskById,
  deleteTask: deleteTask,
  editTask: editTask
};