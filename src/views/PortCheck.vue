<template>
  <el-form
    label-position="top"
    label-width="100px"
    :model="databaseInfo"
    style="max-width: 460px"
  >
    <el-form-item label="host">
      <el-input v-model="databaseInfo.host" />
    </el-form-item>
    <el-form-item label="user">
      <el-input v-model="databaseInfo.user" />
    </el-form-item>
    <el-form-item label="password">
      <el-input v-model="databaseInfo.password" />
    </el-form-item>
    <el-form-item label="database">
      <el-input v-model="databaseInfo.database" />
    </el-form-item>
     <el-form-item label="port">
      <el-input v-model="databaseInfo.port" placeholder="3306" />
    </el-form-item>
    <el-button  @click="conn()">连接</el-button>
    <el-button  @click="testConn()">测试链接</el-button>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ElLoading } from 'element-plus'

const fullscreenLoading = ref(false)
const mysql = require('mysql2')

const databaseInfo = reactive({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: '',
  port: '3306'
})

function conn(){
  const connection = mysql.createConnection({
    host: databaseInfo.host,
    user: databaseInfo.user,
    password: databaseInfo.password,
    database: databaseInfo.database,
    port: databaseInfo.port
  })
connection.query(
  'show databases;',(err:any, result:any, fields:any) => {
    console.log('result', result)
    console.log('fields', fields)
  }
)

connection.query(
  'select * from host_summary_by_file_io;',(err:any, result:any, fields:any) => {
    console.log('result', result)
    console.log('fields', fields)
  }
)

}

/**
 * 测试链接
 */
function testConn(){
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const connection = mysql.createConnection({
    host: databaseInfo.host,
    user: databaseInfo.user,
    password: databaseInfo.password,
    database: databaseInfo.database,
    port: databaseInfo.port,
    connectTimeout: 5000
  })
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