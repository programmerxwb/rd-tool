<template>
<div>
  <el-icon :size="20" @click="copyJosn" style="cursor:pointer;">
    <el-icon><CopyDocument /></el-icon>
  </el-icon>
    <el-row>
      <el-col :span="10">
        <textarea
          class="json"
          v-model="originalJson"
          placeholder="请输入JSON"
        />
      </el-col>
      <el-col :span="14">
        <div  id='cleanJson' class="json clean" v-html="cleanJson"></div>
      </el-col>
    </el-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const originalJson = ref('')
const cleanJson = ref('')
watch(originalJson, () => {
  clean()
  })

function copyJosn(){
  toClipboard(JSON.stringify(JSON.parse(originalJson.value), null, 2))
}

function clean() {
  if (originalJson.value == null || originalJson.value == '') {
    cleanJson.value = ''
    return
  }
  let newJson = ''
  let oldJson = ''
  try {
      oldJson = JSON.stringify(JSON.parse(originalJson.value), null, 2)
  } catch (error) {
    cleanJson.value = 'json错误'
    return
  }
  
  let oldJsonArray = oldJson.split('\n')
  for (let index = 0; index < oldJsonArray.length; index++) {
    let element = oldJsonArray[index]
    let spiltLength = element.search(':')
    let valueTest = element.substring(spiltLength+1, element.length)
    if (element.search(':') != -1 && valueTest !== ' {' && valueTest !== ' [') {
      element = element.substring(0, spiltLength) + ':' + '<span class = "value">' + element.substring(spiltLength+1, element.length) + '</span>'
    }
    newJson = newJson + element + '<br>'
  }
  cleanJson.value = newJson
  
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.json{
white-space:break-spaces;
  text-align:left;
  font-weight:bold;
  overflow-x:auto;
  border:1px solid gray;
  width: 100%;
  height: 572px;
  padding: 0;
  resize: none;
}

</style>
