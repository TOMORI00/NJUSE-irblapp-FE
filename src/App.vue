<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  methods: {
    testAPI() {
      this.$http({
        method: 'get',
        url: 'signIn',
        params: 'signIn'
      }).then(res => {
        console.log(res)
      })
      this.$http({
        method: 'get',
        url: 'signUp',
        params: 'signUp'
      }).then(res => {
        console.log(res)
      })
      this.$http({
        method: 'post',
        url: 'upload',
        params: 'upload'
      }).then(res => {
        console.log(res)
      })
      this.$http({
        method: 'get',
        url: 'query',
        params: 'query'
      }).then(res => {
        console.log(res)
      })
      this.$http({
        method: 'get',
        url: 'show'
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
