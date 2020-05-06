<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="avatar"/>
      </div>

      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef" :model="loginForm" :rules="loginFormRules"
          label-width="60px" class="login_form">

          <el-form-item label="手机" prop="phone">
            <el-input v-model="loginForm.phone" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password" type="password"
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>

          <div class="register" @click="toRegister">注册店铺</div>
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
        loginForm: {
          phone: '15622958503',
          password: '123456'
        },
        // 表单验证
        loginFormRules: {
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
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      },
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) {
            return
          }

          const res = await this.$http.post('login', this.loginForm)

          if (res.status !== 200) {
            return this.$message.error('登录失败')
          }

          window.sessionStorage.setItem('me', res.data)
          window.sessionStorage.setItem('cookie', res.headers["Set-Cookie"])

          this.$message.success('登录成功')

          await this.$router.push('/home')
        })
      },
      toRegister() {
        this.$router.push('/register')
      }
    }
  }

</script>

<style lang="less" scoped>
  /* // lang="less" 支持less格式
  // scoped vue的指令，只在当前组件生效 */
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 360px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_form {
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
    cursor: pointer;
  }
</style>
