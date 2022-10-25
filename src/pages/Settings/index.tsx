import React, { useEffect, useState } from "react";
import "./style.scss";
import CloseIcon from "assets/images/icon-close.svg";
import Button from "components/button";
import { changeConfig, changeMode, getConfig, getMode} from "store/db";
import { useSignOut } from 'react-auth-kit'
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate()
  const signOut = useSignOut()
  const [continuous, setContinuous] = useState<any>()
  const [fastMode, setFastMode] = useState<any>()

  useEffect(() => {
    const setConf = async () => {
      const mode = await getMode()
      const cont = await getConfig()
      setFastMode(mode)
      setContinuous(cont)
    }
    setConf()
  }, [])
  
  const handleChange = async (e:any) => {
    console.log("continuous?", e.target.checked)
    setContinuous((check: any) => !check)
    await changeConfig(e.target.checked)
  }

  const handleChangeMode = async (e:any) => {
    console.log("mode?", e.target.checked)
    setFastMode((check: any) => !check)
    await changeMode(e.target.checked)
  }

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="settings">
      <div className="settings__top">
        <h3 className="title">Iestatījumi</h3>
        <img className="closeIcon" src={CloseIcon} onClick={() => navigate(-1)} alt="closeIcon" />
      </div>
      <div className="settings__content">
        <h3 className="title">Reģistrācijas režīms</h3>
        <div className="change-mode">
          <h3>Nepārtraukta reģistrācija</h3>
          <div className="checkboxWrapper">
            <input
              className="react-switch-checkbox"
              type="checkbox"
              key={Math.random()}
              checked={continuous}
              id="checkboxThreeInput"
              onChange={handleChange}
              name=""
            />
            <label
              style={{ background: continuous ? "#7159BD" : "white" }}
              className="react-switch-label"
              htmlFor="checkboxThreeInput">
              <span className={`react-switch-button`} />
            </label>
          </div>
        </div>
        <div className="change-mode">
          <h3>Nepārtraukta SlowMode</h3>
          <div className="checkboxWrapper">
            <input
              className="react-switch-checkbox"
              type="checkbox"
              key={Math.random()}
              checked={fastMode}
              id="checkboxSecondInput"
              onChange={handleChangeMode}
              name=""
            />
            <label
              style={{ background: fastMode ? "#7159BD" : "white" }}
              className="react-switch-label"
              htmlFor="checkboxSecondInput">
              <span className={`react-switch-button`} />
            </label>
          </div>
        </div>
      </div>
      <div className="logout">
        <Button
          disabled={false}
          title="Izlogoties"
          iconLogOut={true}
          type="redBordered"
          iconArrow={true}
          onClick={handleSignOut}
          iconPersonalQR={undefined}
        />
      </div>
    </div>
  );
};

export default Settings;
