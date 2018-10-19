<template>
  <div id="app">
    <div id="nav">
      <transition enter-active-class="animated slideInDown" 
leave-active-class="animated slideOutUp">
  <div v-if="offline">
    <p>
      Offline: Trying to connect. Please keep tab open.
    </p>
  </div>
</transition>
      <router-link to="/">Home</router-link> |
      <router-link to="/profile">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  data(){
    return {
      offline: false
    }
  },
methods:{
    networkChange(e){
      console.log(e)
      if(e.type=="offline"){
        this.offline=true
      }else{
        this.offline=false
      }
    }
}}
  </script>
<style lang="stylus">

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983
</style>
