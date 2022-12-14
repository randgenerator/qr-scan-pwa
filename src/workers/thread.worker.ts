import { SendOffline } from "../offline/index";

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = async ({ data }) => {
  let { type } = data;
  if (type === "UPDATE") {
    await SendOffline()
    /* eslint-disable-next-line no-restricted-globals */
    setTimeout(() => self.postMessage({type: "UPDATE_SUCCESS"}), 3000)
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