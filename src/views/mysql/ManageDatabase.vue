<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-select v-model="databaseInfo.database" class="m-2" placeholder="Select" size="large">
          <el-option
            v-for="item in databaseInfo.databases"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-scrollbar height="400px">
            <el-tree :data="databaseInfo.tables" @node-click="click"/>  
          </el-scrollbar>
        </el-aside>
        <el-container>
          <el-main>
            <el-input
              v-model="textarea"
              :rows="2"
              type="textarea"
              placeholder="Please input"
            />
          </el-main>
          <el-footer>
            
          </el-footer>
        </el-container>
      </el-container>
     
      <button @click="query">aa</button>
      <el-table :data="queryResult.result" style="width: 100%">
        <el-table-column v-for="(item) in queryResult.fields" :prop="item" :label="item"/>
      </el-table>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { Result } from '../../model/mysql/Result'
import mitter from '@/utils/mitt'

interface Tree {
  label: string
}

interface queryResult {
  fields: string[],
  result: any[]
}

let connection:any = null;
const textarea = ref('')
// 接收数据源
mitter.on("count",(conn:any) => {
  connection = conn
  getDatabases()
})

interface DatabaseInfo {
    databases:string[],
    database:string,
    tables:Tree[]
}

const databaseInfo = reactive<DatabaseInfo>({
  databases: [],
  database: '',
  tables:[]
})

const queryResult = reactive<queryResult>({
  fields:  [],
  result: []
})

/**
 * 监控数据改变
 */
watch(()=>databaseInfo.database, () => {
  switchDatabase()
})

/**
 * 选中数据库 文本框中添加查找语句
 * @param val 
 */
function click(val:any) {
  textarea.value += '\nselect * from ' + val.label + ';'
}

/**
 * 切换数据库
 */
function switchDatabase() {
  databaseInfo.tables = []
  connection.query('use `' + databaseInfo.database +'`;', (err:any, result:Result[], fields:[]) => {
    if(err) {
      // TODO
      console.log(err)
    }
  })

  connection.query('show tables;', (err:any, result:any[], fields:any[]) => {
  result.map((item:any) =>databaseInfo.tables.push({'label': item[fields[0].name]}))})
}

/**
 * 查询数据
 */
function query() {
  queryResult.fields = []
  connection.query(textarea.value ,(err:any, result:Result[], fields:[]) => {
    fields.map((item:any) =>queryResult.fields.push(item.name))
    queryResult.result = result
  })
}

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