import SendOffline from '../src/offline'

self.addEventListener('message', ({ data }) => {

  let { type, payload } = data;

  if (type === 'UPDATE') {
    setTimeout(() => SendOffline, payload)

    self.postMessage({ type: 'UPDATE_SUCCESS', payload: "success" });

  }

});


self.addEventListener(

  'exit',

  () => {

    process.exit(0);

  },

  false

);