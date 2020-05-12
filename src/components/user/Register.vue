<template>
  <div class="register_container">
    <div class="register_box">
      <div class="title-up">
        申请商铺
      </div>

      <div>
        <el-form
          ref="registerFormRef" :model="registerForm" :rules="registerFormRules"
          label-width="80px" class="register_form">

          <el-form-item label="店名" prop="name">
            <el-input v-model="registerForm.name" prefix-icon="el-icon-s-goods"></el-input>
          </el-form-item>

          <el-form-item label="联系人" prop="name">
            <el-input v-model="registerForm.shopKeeper" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" prefix-icon="el-icon-phone"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password" type="password"
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword" type="password"
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>


          <el-form-item label="描述" prop="name">
            <el-input
              v-model="registerForm.description"
              prefix-icon="el-icon-info"></el-input>
          </el-form-item>

          <el-form-item label="地区" prop="phone">
            <template>
              <el-select v-model="registerForm.areaId" placeholder="请选择">
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item class="btns">
            <el-button type="info" @click="insertTestData">测试数据</el-button>
            <el-button type="info" @click="goBack">返 回</el-button>
            <el-button type="primary" @click="register">注 册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      // 手机号验证规则
      let checkMobile = (rule, value, callback) => {
        const regMobile = /^1[3-9]\d{9}$/

        if (regMobile.test(value)) {
          // 校验通过
          callback()
        }

        callback(new Error('请输入合法的手机号'))
      }

      let checkPassword = (rule, value, callback) => {
        if (this.registerForm.password === value) {
          // 校验通过
          callback()
        }

        callback(new Error('两次密码不一致'))
      }

      return {
        registerForm: {},
        // 表单验证
        registerFormRules: {
          phone: [
            {
              required: true,
              message: '请输入店铺手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ],
          password: [
            {required: true, message: '请输入店铺密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {
              validator: checkPassword,
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '此项不能为空',
              trigger: 'blur'
            }
          ]
        },

        // 地区列表
        areaList: []
      }
    },
    async created() {
      await this.getAreaList()
    },
    methods: {
      // 获取地区列表
      async getAreaList() {
        const res = await this.$http.get(`area`)

        if (res.status !== 200) {
          return this.$message.error('获取区域列表失败')
        }

        this.areaList = res.data
      },
      // 返回按钮
      goBack() {
        this.$router.back()
      },
      // 注册
      register() {
        this.$refs.registerFormRef.validate(valid => {
          if (!valid) {
            return
          }

          this.$http.post('register', this.registerForm).then(() => {
            this.$message.success('申请成功，稍等管理员通知结果')

            this.$router.back()
          }, () => {
            return this.$message.error('申请失败')
          })
        })
      },
      // 填入测试数据
      insertTestData() {
        this.registerForm = {
          name: "生鲜店铺",
          shopKeeper: "许达成",
          phone: '15645678912',
          password: '123456',
          confirmPassword: '123456',
          description: '一间好店铺',
          areaId: 441928
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  /* // lang="less" 支持less格式
  // scoped vue的指令，只在当前组件生效 */
  .register_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .register_box {
    width: 450px;
    height: 580px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
  }

  .title-up {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 14px 0;
    font-size: 22px;
  }

  .register_form {
    position: absolute;
    margin-top: 20px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  .info {
    font-size: 13px;
    margin: 10px 15px;
  }


  .register {
    position: absolute;
    bottom: -40px;
    right: 24px;
    color: #409eff;
  }
</style>
