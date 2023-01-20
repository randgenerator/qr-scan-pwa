import React from "react";
import "./style.scss";
import { ReactComponent as RefreshIcon } from "assets/images/refreshIcon.svg";

const RefreshSound = ({setPaused}:{setPaused:any}) => {

  const unpause = () => {
    setPaused(false)
  }

  return (
    <div className="refreshSound">
      <div className="refreshSound__text">
        <RefreshIcon />
        <p>Atjaunojiet skaņas paziņojumus!</p>
      </div>
      <button type="button" onClick={unpause} className="refreshSound__btn">
        Atjaunot
      </button>
    </div>
  );
};

export default RefreshSound;
