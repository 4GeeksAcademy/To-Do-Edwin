import React, { useState } from "react";
import Task from "./Task";

const Home = () => {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
    console.log(newTask);
  };

  const handleAddTask = () => {
    const newInput = {
      text: newTask,
    };
    setTask([...task, newInput]);
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

      <div className="row-col-6">
        {task.map((task, index) => (
          <div className="gx-2" key={index}>
            <Task task={task.text} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;