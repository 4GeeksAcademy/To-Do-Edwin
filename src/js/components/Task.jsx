import React from "react";
import "../../styles/task.css";
import PropTypes from "prop-types";

const Task = (props) => {
  return (
    <div className="input-group my-3">
      <span className="input-group-text">{props.task}</span>
      <button
        className="btn btn-outline-secondary"
        type="button"
        id="button-addon2"
        onClick ={() => props.onDelete(props.task)}
      >
        X
      </button>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.string,
  onDelete: PropTypes.func
};

export default Task;
