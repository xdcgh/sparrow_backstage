<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>添加生鲜</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="title-up">添加生鲜</el-row>

      <el-form ref="addFormRef" :model="addForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-input v-model="addForm.picture" placeholder="目前仅支持图片地址链接哦"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-select v-model="addForm.status" placeholder="请选择">
              <el-option
                v-for="item in freshStatusList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="类型" prop="freshType">
          <template>
            <el-select v-model="addForm.typeId" placeholder="请选择">
              <el-option
                v-for="item in freshTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="addForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
      </el-form>

      <el-row class="footButtons">
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="addFresh">确 定</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      // 验证规则
      const checkStock = (rule, value, callback) => {
        const regMobile = /^(0|[1-9][0-9]*)$/

        if (regMobile.test(value)) {
          // 校验通过
          callback()
        }

        callback(new Error('请输入大于等于零的整数'))
      }

      const checkPrice = (rule, value, callback) => {
        const regMobile = /^(\d|[1-9]\d+)(\.\d{1,2})?$/

        if (regMobile.test(value)) {
          // 校验通过
          callback()
        }

        callback(new Error('请输入大于等于零的实数（最大两位小数）'))
      }

      return {
        addForm: {
          status: "在线",
          typeId: 1
        },

        freshStatusList: ["在线", "下架"],
        freshTypeList: [],

        editFormRules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          picture: [
            {
              required: true,
              message: '请输入图片地址',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: '请输入描述',
              trigger: 'blur'
            }
          ],
          stock: [
            {
              required: true,
              message: '请输入库存',
              trigger: 'blur'
            },
            {
              validator: checkStock,
              trigger: 'blur'
            }
          ],
          price: [
            {
              required: true,
              message: '请输入价格',
              trigger: 'blur'
            },
            {
              validator: checkPrice,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.getFreshTypeList()
    },
    methods: {
      async getFreshTypeList() {
        const res = await this.$http.get("freshType")

        if (res.status !== 200) {
          return this.$message.error('生鲜状态切换失败')
        }

        this.freshTypeList = res.data
      },
      async addFresh() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return
          }

          const res = await this.$http.post(`fresh`, {
            ...this.addForm
          })

          if (res.status !== 200) {
            return this.$message.error('添加失败')
          }

          this.$message.success('添加成功')

          this.resetForm()
        })
      },
      resetForm() {
        this.$refs.addFormRef.resetFields()
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

  .footButtons {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
  }

</style>
