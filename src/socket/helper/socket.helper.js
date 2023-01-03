export const socketLogger = (type, message, payload) => {
  console.log(`
  Socket logger...,
  TYPE : ${type},
  MESSAGE : ${message},
  ${payload ? 'payload=>' : ''}`, payload || '');
};
