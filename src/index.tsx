import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from "routes";
import "assets/styles/main.scss";
import "assets/styles/fonts.css";
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import reportWebVitals from 'reportWebVitals';
import { clearDb, initDb } from 'store/db';
import isReachable from 'is-reachable';
import SendOffline from 'offline';
import config from "./config/config";
import { store } from './store/store'
import { Provider } from 'react-redux'
const init = async () => {
  await initDb()
  if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
    await SendOffline()
    // await clearDb()
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = ()=><Provider store={store}>
    <Routes />
</Provider>

const renderNode = config.appEnv === 'dev' ?
    <React.StrictMode>
        <App/>
    </React.StrictMode> :
    <App/>

root.render(renderNode);

init()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
