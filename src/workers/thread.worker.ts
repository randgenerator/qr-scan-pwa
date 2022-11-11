import { SendOffline } from "../offline/index";

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = ({ data }) => {
  let { type, payload } = data;
  if (type === "UPDATE") {
    setTimeout(() => SendOffline(), payload);
  }
};

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener(
  "exit",

  () => {
    process.exit(0);
  },

  false,
);
