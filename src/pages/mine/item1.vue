<template functional>
 <li>
     <div>
         <h5>werwr</h5>
         <p>werwr</p>
     </div>
     <button><span>werwrwr</span></button>
 </li>
</template>

<script>
export default {
  props: {
      item: {
          type: Object,
          default: ()=>({})
      }
  }
}
</script>
<style lang="less" scoped>
li {
    display: flex;
    align-items: center;
    &> div {
        flex: 1;
        margin-right: 20px;
    }
    button {

    }
}
</style>
