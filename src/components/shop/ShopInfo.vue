<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>店铺信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="title-up">店铺信息</el-row>

      <el-form ref="shopFormRef" :model="shopForm" :rules="shopFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="shopForm.name"></el-input>
        </el-form-item>
<!--        <el-form-item label="LOGO" prop="picture">-->
<!--          <el-input v-model="shopForm.logo" placeholder="目前仅支持图片地址链接哦"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="联系人">
          <el-input v-model="shopForm.shopKeeper" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="shopForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="shopForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-select v-model="shopForm.status" placeholder="请选择">
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
          <el-input v-model="shopForm.createdAt" disabled></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="shopForm.updatedAt" disabled></el-input>
        </el-form-item>
      </el-form>

      <el-row class="footButtons">
        <el-button @click="resetForm">还 原</el-button>
        <el-button type="primary" @click="updateShop">更 新</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shopForm: {},
        shopFormRules: {},
        shopStatusList: ["营业", "停业"],

        shop: {}
      }
    },
    created() {
      this.getShop()
    },
    methods: {
      async getShop() {
        const res = await this.$http.get(`status`)

        if (res.status !== 200) {
          return this.$message.error('获取商铺信息失败')
        }

        this.shop = res.data

        // 深度拷贝
        this.shopForm = JSON.parse(JSON.stringify(this.shop))
      },
      // 重置表单
      resetForm() {
        this.shopForm = this.shop
        this.shopForm.status = this.shop.status
      },
      // 更新商店信息
      async updateShop() {
        const res = await this.$http.patch(`shop`, {
          ...this.shopForm
        })

        if (res.status !== 200) {
          return this.$message.error('更新失败')
        }

        this.shop = JSON.parse(JSON.stringify(this.shopForm))

        this.$message.success('更新成功')
      }
    }
  }
</script>

<style lang="less" scoped>
  .title-up {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 25px;
    margin-bottom: 24px;
  }
</style>
