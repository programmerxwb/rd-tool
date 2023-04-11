<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    :router="true"
  >
    <el-menu-item index="0">RD-TOOL</el-menu-item>
    <div class="flex-grow" />
    <el-sub-menu index="2">
      <template #title>格式化工具</template>
      <el-menu-item index="/format/json">JSON</el-menu-item>
      <el-menu-item index="/format/xml">XML</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/port/check">端口检测</el-menu-item>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>