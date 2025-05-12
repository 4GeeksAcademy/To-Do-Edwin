import "../../styles/task.css";
import PropTypes from "prop-types";

const Task = ({task, onDelete}) => {
  return (
    <div className="input-group my-3">
      <span className="input-group-text">{task}</span>
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick ={() => onDelete()}
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
