<template>
  <div id="app">
    <keep-alive :include="$store.state.cachePage">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
