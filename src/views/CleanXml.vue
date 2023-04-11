<template>
<div>
  <el-icon :size="20" @click="copyJosn" style="cursor:pointer;">
    <el-icon><CopyDocument /></el-icon>
  </el-icon>
    <el-row>
      <el-col :span="10">
        <textarea
          class="json"
          v-model="originalXml"
          placeholder="请输入Xml"
        />
      </el-col>
      <el-col :span="14">
        <div  id='cleanXml' class="json clean" v-html="cleanXml"></div>
      </el-col>
    </el-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useClipboard from "vue-clipboard3";


const { toClipboard } = useClipboard();
const originalXml = ref('')
const cleanXml = ref('')
watch(originalXml, () => {
  clean()
  })

function copyJosn(){
  let xml = cleanXml.value
  xml = xml.replaceAll('<xmp>','')
  xml = xml.replaceAll('</xmp>','')
  toClipboard(xml)
}


  //格式化xml代码
function clean() {
  let text = originalXml.value
  //使用replace去空格
  text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
    return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
  }).replace(/>\s*?</g, ">\n<");
  //处理注释
  text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
    var ret = '<!--' + escape(text) + '-->';
    return ret;
  }).replace(/\r/g, '\n');
  //调整格式	以压栈方式递归调整缩进
  var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
  let nodeStack:string[] = [];
  var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
    var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
    var prefix = '';
    if (isBegin == '!') {//!开头
      prefix = setPrefix(nodeStack.length);
    } else {
      if (isBegin != '/') {///开头
        prefix = setPrefix(nodeStack.length);
        if (!isClosed) {//非关闭标签
          nodeStack.push(name);
        }
      } else {
        nodeStack.pop();//弹栈
        prefix = setPrefix(nodeStack.length);
      }
    }
    var ret = '\n' + prefix + all;
    return ret;
  });
  var prefixSpace = -1;
  var outputText = output.substring(1);
  //还原注释内容
  outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
    if (prefix.charAt(0) == '\r')
      prefix = prefix.substring(1);
    text = unescape(text).replace(/\r/g, '\n');
    var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
    return ret;
  });
  outputText = outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
  outputText = '<xmp>' + outputText + '</xmp>'
  cleanXml.value = outputText;
}
 
//计算头函数	用来缩进
function setPrefix(prefixIndex:number) {
  var result = '';
  var span = '    ';//缩进长度
  var output = [];
  for (var i = 0; i < prefixIndex; ++i) {
    output.push(span);
  }
  result = output.join('');
  return result;
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
