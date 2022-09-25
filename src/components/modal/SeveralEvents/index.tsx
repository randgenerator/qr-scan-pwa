import React, { useState } from "react";
import "./style.scss";
// import Button from "components/button";


import IconDanger from "assets/images/icon-danger.svg";
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import axios from "axios";
import { getToken } from "store/db";

const SeveralEvents = ({events, attendee, showModal, showError, scanAllowed, showSuccess}:{events:any, attendee:any, showModal:any, showError: any, scanAllowed:any, showSuccess: any}) => {
  
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText('#00b578'),
    backgroundColor: '#00b578',
  }));

  const handleRegister = async (e:any) => {
    const id = e.target.value
    const token = await getToken()
    await axios.post(`https://pa-test.esynergy.lv/api/v1/pwa/attendance/${id}/verify`, {}, {
          headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then(function (response) {
          showModal(false)
          showSuccess(true)
          setTimeout(() => scanAllowed(true), 3000)
        })
        .catch(function (error) {
          if (error.response.data.error) {
            if (error.response.data.error.includes("already")) {
              showModal(false)
              showError(true)
              setTimeout(() => scanAllowed(true), 3000)
            }
          }
        })
  }

  return (
    <div className="severalEvents">
      <div className="severalEvents__wrapper">
        <img src={IconDanger} alt="iconChecked" />
        <h3>Attendant marked attending several events!</h3>
        <p>{`${attendee[0].full_name}, ${attendee[0].class_name}`}</p>
        <div>
          {events.map((event:any) => {
            const att = attendee.find((att:any) => att.attendance_id === event.id)
            return (
              <>
              <div className="lunchSeries">
                <h4 className="lunchTitle">{event.service_series_name}</h4>
                <span>{att.status}</span>
              </div>
              <ColorButton value={att.id} type="button" onClick={handleRegister} >Register attendance</ColorButton>
              </>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default SeveralEvents;
