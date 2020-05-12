<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>店铺信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="title-up">店铺信息</el-row>

      <el-form ref="addFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="picture">
          <el-input v-model="editForm.logo" placeholder="目前仅支持图片地址链接哦"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="description">
          <el-input v-model="editForm.shopKeeper"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="description">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-select v-model="editForm.status" placeholder="请选择">
              <el-option
                v-for="item in shopStatusList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="editForm.createdAt"></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="editForm.updatedAt"></el-input>
        </el-form-item>
      </el-form>

      <el-row class="footButtons">
        <el-button @click="resetForm">还 原</el-button>
        <el-button type="primary" @click="addFresh">更 新</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editForm: {},
        editFormRules: {}
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
