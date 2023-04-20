<template>
  <div class="common-layout">
      <el-container>
      <el-header>
      </el-header>
        <el-container>
        <div class="aside">
          <el-scrollbar :height="theme.height">
            <el-tree :data="databaseInfo.tables" @node-click="click"/>  
          </el-scrollbar>
        </div>
        <div class="sliding-bar-height" @mousedown="onTdMousedown($event)"></div>
        <el-container>
          <div class = "main">
            <div class="operate">
              <el-button type="success" @click="query" circle size="small">
                <el-icon>
                  <VideoPlay />
                </el-icon>
              </el-button>
              <el-select v-model="databaseInfo.database" size="small" placeholder="选择数据库">
                <el-option
                  v-for="item in databaseInfo.databases"
                  :key="item"
                  :label="item"
                  :value="item"/></el-select>
              <div class="sqlarea" v-html="textarea" contenteditable @blur="sqlChange($event)"/>
            </div>
        </div>
        </el-container>
      </el-container>
      <div class="sliding-bar-width" @mousedown="onWidthMousedown($event)"></div>
      <el-table height="250" :data="queryResult.result" style="width: 100%" stripe>
        <el-table-column v-for="(item) in queryResult.fields" :prop="item.name" :label="item.name" />
      </el-table>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { Result } from '@/model/mysql/Result'
import { Field } from '@/model/mysql/Field'
import mitter from '@/utils/mitt'
import { isDate } from '@/constans/mysql/Type'
import moment from 'moment'
import { VideoPlay } from '@element-plus/icons-vue'

interface Tree {
  label: string
}

interface queryResult {
  fields: Field[],
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
  textarea.value += '<br/>select * from ' + val.label + ';'
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
 async function query() {
  queryResult.fields = []
  queryResult.result = []
  let currFields:Field[] = []
  let [result, fields] = await connection.promise().query(textarea.value)
  fields.map((item:any) =>currFields.push({name: item.name, isDate: isDate(item.type)}))
  for (let column of result) {
    let obj:any={}
    for(let field of currFields) {
      if (field.isDate) {
        let columnValue:any = column[field.name]
        columnValue = columnValue==null || columnValue == undefined ? moment(columnValue).format('YYYY-MM-DD HH:mm:ss') : null
        obj[field.name] = columnValue
      } else {
        obj[field.name] = column[field.name]
      }
    }
    queryResult.result.push(obj)
  }
    queryResult.fields=currFields
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

function sqlChange(event:any) {
  console.log(event)
  console.log(event.target.outerText)
  textarea.value = event.target.outerText
}

const theme = reactive({
  width: '200px',
  height: '200px'
})

function onTdMousedown(e: MouseEvent) {
  window.addEventListener('mousemove', updateTarget);
  window.onmouseup = function () {
    window.onmouseup = null;
    window.removeEventListener('mousemove', updateTarget);
  };
}

const updateTarget = (event: MouseEvent) => {
  let width = parseInt(theme.width); 
  width += event.movementX
  if (width <= 20 || width > document.body.offsetWidth - 100) {
    return
  }
  theme.width = width + 'px'
  // movementX/movementY
  // 两个鼠标移动事件间隔时间中当中鼠标移动的相对坐标;
}

function onWidthMousedown(e: MouseEvent) {
  window.addEventListener('mousemove', updateWidthTarget);
  window.onmouseup = function () {
    window.onmouseup = null;
    window.removeEventListener('mousemove', updateWidthTarget);
  };
}

const updateWidthTarget = (event: MouseEvent) => {
  let height = parseInt(theme.height); 
  height += event.movementY
  theme.height = height + 'px'
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.aside{
  border: 1px solid #000;
  width: v-bind('theme.width');
}

.sliding-bar-height {
  border: 1px solid grey;
  cursor: move;
}
.sliding-bar-width{
  border: 1px solid grey;
  cursor: move;
}

.main{
    height: v-bind('theme.height');
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .sqlarea{
    height:100%;
    width: 100%;
    margin: 0;
    vertical-align:top;
    margin: 0;
    padding: 0;
    border: 1px solid #000;
  }


  .operate{
    height:100%;
    width: 100%;
    border: 1px solid #000;
  }
</style>