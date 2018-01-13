<template>
  <div>
    <div>test</div>
    <a href="#">Hi</a>
    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<style lang="scss">
.main {
  color: #fff;
}
</style>


<script>
// import './base';
// import './base2';
import { globalSymbol } from './base3';
// import dom from './dom';

console.info('全局Symbol', String(globalSymbol), globalSymbol === Symbol.for('s1'));
export default {
  mounted() {
    // dom();
  }
};
</script>
