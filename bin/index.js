#! /usr/bin/env node
const fs = require("node:fs");
const path = require("path");

const args = process.argv.slice(2);
const [op, ...moreArgs] = args;

switch (op) {
  case "add": {
    const description = moreArgs[0];
    addTask(description);
    break;
  }
  case "update": {
    const id = Number(moreArgs[0]);
    const description = moreArgs[1];
    updateTask(id, description);
  }
  case "mark-in-progress":
    break;
  case "mark-down":
    break;
  default:
    break;
}

function addTask(description) {
  const tasks = readTasks();
  const newId = getNextId(tasks);
  const now = new Date().toISOString();
  const newTask = {
    id: newId,
    description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  writeTasks(tasks);
}

function updateTask(id, newDescription) {
  const tasks = readTasks();
  const newTasks = tasks.map((task) => {
    const now = new Date().toISOString();
    console.log(task.id, id);
    if (task.id === id) {
      return {
        ...task,
        description: newDescription,
        updatedAt: now,
      };
    } else {
      return task;
    }
  });
  writeTasks(newTasks);
}

function readTasks() {
  const filePath = path.join(__dirname, "../tasks.json");
  const file = fs.readFileSync(filePath, "utf8");
  const tasks = JSON.parse(file).data;
  return tasks;
}

function getNextId(tasks) {
  let res = 1;
  tasks.forEach((task) => {
    res = Math.max(task.id, res);
  });
  return res++;
}

function writeTasks(tasks) {
  const filePath = path.join(__dirname, "../tasks.json");
  const data = JSON.stringify({ data: tasks });
  fs.writeFileSync(filePath, data, "utf-8");
}
