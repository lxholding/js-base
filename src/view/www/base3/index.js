import syntax from './syntax';
import singleInstance from './symbo';

console.group('syntax');
const { globalSymbol } = syntax();
console.info('全局Symbol', globalSymbol === Symbol.for('s1'));
console.info(singleInstance.info, singleInstance.foo);
console.groupEnd();

export { globalSymbol };
