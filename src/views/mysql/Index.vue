<template>
  <Database v-show="!isConn" @getConnection="getConnection"/>
  <Manage v-show="isConn"/>
</template>

<script lang="ts" setup>
import Database from './ConnDatabase.vue'
import Manage from './Manage.vue'
import {ref } from 'vue'
const isConn=ref<boolean>(false)
function getConnection(connection:any){
  isConn.value = true
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>