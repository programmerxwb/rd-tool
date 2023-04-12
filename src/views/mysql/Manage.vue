<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-select v-model="databaseInfo" class="m-2" placeholder="Select" size="large">
          <el-option
            v-for="item in databaseInfo.databases"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
      <button @click="getDatabases">aa</button>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Result } from '../../model/mysql/Result'
import mitter from '@/utils/mitt'

let connection:any = null;
// 接收数据源
mitter.on("count",(conn:any) => {
  connection = conn
  getDatabases()
})

interface DatabaseInfo {
    databases:string[]
}

const databaseInfo = reactive<DatabaseInfo>({
  databases: []
})

/**
 * 初始化数据库
 */
function getDatabases (){
  databaseInfo.databases = []
  connection.query('show databases;',(err:any, result:Result[], fields:[]) => {
  result.map((item) =>databaseInfo.databases.push(item.Database))
 })
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>