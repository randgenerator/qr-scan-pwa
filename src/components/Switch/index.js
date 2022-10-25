import React from "react";
import "./switch.scss";

const Switch = ({ isOn, handleToggle }) => {
  return (
    <div>
      {" "}
      <input
        className="react-switch-checkbox"
        type="checkbox"
        key={Math.random()}
        checked={isOn}
        id="checkboxThreeInput"
        onChange={handleToggle}
        name=""
      />
      <label
        style={{ background: isOn ? "#7159BD" : "white" }}
        className="react-switch-label"
        htmlFor="checkboxThreeInput">
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};

export default Switch;
