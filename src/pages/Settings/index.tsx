import React, { useEffect, useState } from "react";
import "./style.scss";
import CloseIcon from "assets/images/icon-close.svg";
import Button from "components/button";
import { changeConfig, getConfig} from "store/db";
import { useSignOut } from 'react-auth-kit'
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate()
  const signOut = useSignOut()
  const [continuous, setContinuous] = useState<boolean | undefined>(true)

  useEffect(() => {
    const setConf = async () => {
      setContinuous(await getConfig())
    }
    setConf()
  }, [])
  
  const handleChange = (e: any) => {
    setContinuous(e.target.checked)
    changeConfig(e.target.checked)
  }

  const handleSignOut = () => {
      signOut()
      navigate('/')
  }

  return (
    <div className="settings">
      <div className="settings__top">
        <h3 className="title">Settings</h3>
        <img className="closeIcon" src={CloseIcon} onClick={() => navigate(-1)} alt="closeIcon" />
      </div>
      <div className="settings__content">
        <h3 className="title">Registration mode</h3>
        <div className="change-mode">
          <h3> Continuous registration</h3>
          <div className="checkboxWrapper">
            <input type="checkbox" value="" defaultChecked={continuous} id="checkboxThreeInput" onChange={handleChange} name="" />
            <label htmlFor="checkboxThreeInput"></label>
          </div>
        </div>
      </div>
      <div className="logout">
         <Button title="Log out" iconLogOut={true} type="redBordered" iconArrow={true} onClick={handleSignOut} />
      </div>
    </div>
  );
};

export default Settings;
