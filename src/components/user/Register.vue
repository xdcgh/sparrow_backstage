<template>
  <div class="register_container">
    <div class="register_box">
      <div class="title">
        注册商铺
      </div>

      <div>
        <el-form
          ref="registerFormRef" :model="registerForm" :rules="registerFormRules"
          label-width="80px" class="register_form">

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password" type="password"
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button type="primary" @click="register">注册</el-button>
            <el-button type="info" @click="resetregisterForm">重置</el-button>
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

      return {
        registerForm: {
          phone: '15622958503',
          password: '123456'
        },
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
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 表单重置按钮
      resetregisterForm() {
        this.$refs.registerFormRef.resetFields()
      },
      register() {
        this.$refs.registerFormRef.validate(async valid => {
          if (!valid) {
            return
          }

          const {data: res} = await this.$http.post('register', this.registerForm)

          if (res.meta.status !== 200) {
            return this.$message.error('登录失败')
          }

          this.$message.success('登录成功')

          await this.$router.push('/home')
        })
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
    height: 660px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 14px 0;
    font-size: 22px;
  }

  .register_form {
    position: absolute;
    bottom: 60px;
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
