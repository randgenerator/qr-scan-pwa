import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Routes from "routes";
import "assets/styles/main.scss";
import "assets/styles/fonts.css";
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import reportWebVitals from 'reportWebVitals';
import { clearDb, initDb } from 'store/db';
import isReachable from 'is-reachable';

const init = async () => {
  await initDb()
  if (await isReachable("https://pa-test.esynergy.lv")) {
    await clearDb()
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

init()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
