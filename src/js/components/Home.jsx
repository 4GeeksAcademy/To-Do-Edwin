import React, { useState } from "react";
import Task from "./Task";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return; // para q no se agreguen tareas vacias

    const newInput = {
      id: crypto.randomUUID(), // Usa un ID único
      text: newTask,
    };
    setTasks([...tasks, newInput]);
    setNewTask(""); // Limpiar input para poner una nueva tarea
  };

  const deleteTask = (idToDelete) => {
    setTasks(tasks.filter((task) => task.id !== idToDelete));
  };

  return (
    <div className="container">
      <div className="row-col-6 mt-5">
        <div className="">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              aria-label="With input"
              value={newTask}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTask();
                }
              }}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleAddTask}
            >
              Añadir tarea
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {tasks.map((task, index) => (
          <div className="gx-2" key={index}>
            <Task task={task.text} onDelete={() => deleteTask(task.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;