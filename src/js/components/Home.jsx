import React, { useState, useEffect } from "react";
import Task from "./Task";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [theUserExist, setTheUserExist] = useState(false);
  const [username, setUsername] = useState("");
  let initialValue = "";

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

  async function verifyAndDownloadUserData(user) {
    try {
      const resp = await fetch(
        `https://playground.4geeks.com/todo/users/${user}`
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
        }
      } else {
        console.log("Usuario NO existe");
        await createUser(user);
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
        verifyAndDownloadUserData(username);
      }
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

  const deleteTask = async (idToDelete) => {
    try {
      setTasks(tasks.filter((task) => task.id !== idToDelete));
      const resp = await fetch(
        `https://playground.4geeks.com/todo/todos/${idToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (resp.ok) {
        console.log(`Tarea con ID ${idToDelete} eliminada del servidor`);
      } else {
        console.error("Error al eliminar la tarea del servidor");
      }
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved !== "") {      
      initialValue = JSON.parse(saved);
      setUsername(initialValue);
      verifyAndDownloadUserData(initialValue);
    }
  }, []);

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
                localStorage.setItem("username", JSON.stringify(username)),              
                verifyAndDownloadUserData(username)   
              }
            }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={()=> (               
                localStorage.setItem("username", JSON.stringify(username)),              
                verifyAndDownloadUserData(username)           
            )}
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
