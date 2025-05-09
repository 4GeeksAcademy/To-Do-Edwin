import React, { useState, useEffect } from "react";
import Task from "./Task";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [theUserExist, setTheUserExist] = useState();
  const [username, setUsername] = useState("");

  const createUser = (newUsername) => {
    fetch(`https://playground.4geeks.com/todo/users/${newUsername}`, {
      method: "POST",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        console.log(resp.ok); // Será true si la respuesta es exitosa
        console.log("Usuario creado con éxito");
        setTheUserExist(true);
        console.log(resp.status); // El código de estado 201, 300, 400, etc.
        return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
      })
      .then((data) => {
        // Aquí es donde debe comenzar tu código después de que finalice la búsqueda
        console.log(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor        
        alert(
          "Se ha creado un nuevo usuario: " + newUsername
        );
      })
      .catch((error) => {
        // Manejo de errores
        console.log(error);
      });
  };

  function verifyAndDownloadUserData() {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((resp) => {
        if (resp.ok) {
          console.log("Usuario existe");
          setTheUserExist(true);
          return resp.json();
        } else {
          console.log("Usuario NO existe");
          createUser(username);
        }
        console.log(resp.data);
      })
      .then((data) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function postTask(newTask) {
    let filterTasks = { label: newTask.text, is_done: false };

    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "POST",
      body: JSON.stringify(filterTasks),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      if (resp.ok) {
        console.log("Tarea agregada al servidor");
      }
      verifyAndDownloadUserData();
    });
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
