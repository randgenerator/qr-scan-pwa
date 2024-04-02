// Workaround for TypeScript TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'
const windowObj = window as { [key: string]: any };

const exportedObject = {
  appEnv: windowObj['runConfig'].appEnv || 'dev',
};

export default exportedObject;
