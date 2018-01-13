import overview from './overview';

export default () => {
  console.group('DOM概览');
  overview();
  console.groupEnd();
};
