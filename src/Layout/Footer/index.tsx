import React, { useEffect, useState } from "react";
import "./style.scss";
import LoadingButton from '@mui/lab/LoadingButton';
import ScanIcon from "assets/images/icon-QR.svg";
import ListIcon from "assets/images/icon-list.svg";
import { Link } from "react-router-dom";
import { getSelectedEvents } from "store/db";
import {useSelector} from "react-redux";
import {RootState,store} from "../../store/store";
import CircularProgress from "@mui/material/CircularProgress";

const Footer = () => {
  const [activeList, setActiveList] = useState<boolean>(false);
  const [activeScan, setActiveScan] = useState<boolean>(false);
  const selectedEventsIds = useSelector((state: RootState) =>state.eventSlice.selectedEventsIds)
  const asyncAttendancesLoading = useSelector((state: RootState) =>state.attendanceSlice.asyncAttendancesLoading)
  const eventsListAreLoading = useSelector((state: RootState) =>state.eventSlice.eventsListAreLoading)

  const selectQR = () => {
    setActiveScan(true);
    setActiveList(false);
  };

  const selectList = () => {
    setActiveScan(false);
    setActiveList(true);
  };

  const buttonsAreDisabled = asyncAttendancesLoading || eventsListAreLoading || selectedEventsIds?.length === 0

  return (
    <div className="footer">
      <div className={`scanQRcode ${activeScan ? 'active':''} ${buttonsAreDisabled ? 'disabled':''}`}>
          <LoadingButton startIcon={<div></div>} loadingPosition={'start'} disabled={buttonsAreDisabled}>
              <Link to={'/registration'} onClick={selectQR}>
                  {asyncAttendancesLoading || eventsListAreLoading ?  <CircularProgress className={'progress'}/> : <img src={ScanIcon} alt="scanIcon" />}
                  <h3>QR skenēšana</h3>
              </Link>
          </LoadingButton>
      </div>
      <div className={`list ${activeList ? 'active':''} ${buttonsAreDisabled ? 'disabled':''}`}>
          <LoadingButton startIcon={<div></div>} loadingPosition={'start'} disabled={buttonsAreDisabled}>
              <Link to={'/attendanceList'} onClick={selectList}>
                  {asyncAttendancesLoading || eventsListAreLoading ?  <CircularProgress className={'progress'}/> : <img src={ListIcon} alt="listIcon" />}
                  <h3>Apmeklējumu saraksts</h3>
              </Link>
          </LoadingButton>
      </div>
    </div>
  );
};

export default Footer;
