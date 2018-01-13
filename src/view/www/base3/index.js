import syntax from './syntax';

console.group('syntax');
const { globalSymbol } = syntax();
console.info('全局Symbol', globalSymbol === Symbol.for('s1'));
console.groupEnd();

export { globalSymbol };
