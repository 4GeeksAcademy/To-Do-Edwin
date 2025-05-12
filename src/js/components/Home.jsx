import React, { useState, useEffect } from "react";
import Task from "./Task";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [theUserExist, setTheUserExist] = useState(false);
  const [username, setUsername] = useState("");

  const createUser = async (newUsername) => {
    try {
      const resp = await fetch(
        `https://playground.4geeks.com/todo/users/${newUsername}`,
        {
          method: "POST",
          body: JSON.stringify([]),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(resp);
      if (resp.ok) {
        console.log("Usuario creado con éxito");
        setTheUserExist(true);
        alert("Se ha creado un nuevo usuario: " + newUsername);
      }
      return resp.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function verifyAndDownloadUserData() {
    try {
      const resp = await fetch(
        `https://playground.4geeks.com/todo/users/${username}`
      );

      if (resp.ok) {
        console.log("Usuario existe");
        setTheUserExist(true);
        const data = await resp.json();
        if (data.todos) {
          const formattedTodos = data.todos.map((todo) => ({
            id: todo.id,
            text: todo.label,
          }));
          setTasks(formattedTodos);
          alert(
            "Usuario registrado, cantidad de tareas: " + formattedTodos.length
          );
        }
      } else {
        console.log("Usuario NO existe");
        await createUser(username);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function postTask(newTask) {
    try {
      let filterTasks = { label: newTask.text, is_done: false };

      const resp = await fetch(
        `https://playground.4geeks.com/todo/todos/${username}`,
        {
          method: "POST",
          body: JSON.stringify(filterTasks),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.ok) {
        console.log("Tarea agregada al servidor");
      }
      verifyAndDownloadUserData();
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleInputUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return; // para q no se agreguen tareas vacias

    if (theUserExist) {
      const newInput = {
        text: newTask,
      };
      setTasks([...tasks, newInput]);
      setNewTask(""); // Limpiar input para poner una nueva tarea
      postTask(newInput);
    } else {
      alert("No se puede agregar tarea, usuario no existe");
    }
  };

  const deleteTask = (idToDelete) => {
    setTasks(tasks.filter((task) => task.id !== idToDelete));
    fetch(`https://playground.4geeks.com/todo/todos/${idToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          console.log(`Tarea con ID ${idToDelete} eliminada del servidor`);
        } else {
          console.error("Error al eliminar la tarea del servidor");
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud DELETE:", error);
      });
  };

  return (
    <div className="container">
      <div className="row-col-6 mt-5">
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            aria-label="With input"
            value={username}
            onChange={handleInputUsername}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                verifyAndDownloadUserData();
              }
            }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={verifyAndDownloadUserData}
          >
            Ingresar usuario
          </button>
        </div>
      </div>
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
