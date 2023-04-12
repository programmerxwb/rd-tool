<template>
  <el-form
    label-position="top"
    label-width="100px"
    :model="databaseConnInfo"
    style="max-width: 460px">
    <el-form-item label="host">
      <el-input v-model="databaseConnInfo.host" />
    </el-form-item>
    <el-form-item label="user">
      <el-input v-model="databaseConnInfo.user" />
    </el-form-item>
    <el-form-item label="password">
      <el-input v-model="databaseConnInfo.password" />
    </el-form-item>
    <el-form-item label="database">
      <el-input v-model="databaseConnInfo.database" />
    </el-form-item>
     <el-form-item label="port">
      <el-input v-model="databaseConnInfo.port" placeholder="3306" />
    </el-form-item>
    <el-button  @click="conn()">连接</el-button>
    <el-button  @click="testConn()">测试链接</el-button>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ElLoading } from 'element-plus'
import { DatabaseConnInfo } from '../../model/mysql/DatabaseConnInfo'
import mitter from '@/utils/mitt'
const mysql = require('mysql2')

const emit = defineEmits(['getConnection'])
const databaseConnInfo = reactive<DatabaseConnInfo>({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: '',
  port: '3306'
})

/**
 * 获取链接
 */
function getConnection() {
let connection = mysql.createConnection({
    host: databaseConnInfo.host,
    user: databaseConnInfo.user,
    password: databaseConnInfo.password,
    database: databaseConnInfo.database,
    port: databaseConnInfo.port
  })

  return connection
}

/**
 * 连接数据库
 */
function conn(){
  let connection = getConnection()
  // 推送到兄弟组件
  mitter.emit("count",connection)
  emit('getConnection',connection)
  
}

/**
 * 测试链接
 */
function testConn(){
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  let connection = getConnection()
  connection.connect(function(err:any) {
    if (err) {
      ElMessageBox.alert('请确认你的连接信息是否正确','错误',
      {confirmButtonText: 'OK',
      type: 'error'})
      loading.close()
      return
    } else {
      ElMessageBox.alert('你的连接可用','成功',
      {confirmButtonText: 'OK',
      type: 'success'})
    }
    loading.close()
})
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
