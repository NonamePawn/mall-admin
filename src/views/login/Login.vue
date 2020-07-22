<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="logo">
        <img src="../../assets/img/login/logo.png" alt="logo">
      </div>
      <!--登录表单-->
      <el-form class="login_form"
               ref="loginFormRef"
               :model="loginForm"
               :rules="loginFormRules">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user"
                    v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock"
                    v-model="loginForm.password"
                    type="password"></el-input>
        </el-form-item>
        <!--操作-->
        <el-form-item class="button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        //登录表单的数据绑定对象
        loginForm: {
          username: '',
          password: ''
        },
        //登录表单的数据验证对象
        loginFormRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {min: 3, max: 10, message: "长度在 3 到 10 个字符之间", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, max: 15, message: "长度在 6 到 15 个字符之间", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      //重置字段
      reset() {
        this.$refs.loginFormRef.resetFields()
      },
      //登录验证
      login() {
        this.$refs.loginFormRef.validate( async valid => {
          //验证不通过
          if (!valid) return false;
          //验证通过
          else {
            //发送网络请求
            const {data: result} =  await this.$http.post('login', this.loginForm)
            //判断请求是否成功
            if (result.meta.status !== 200) return this.$message.error({duration:500, message:"登录失败"})
            this.$message.success({duration:500, message:"登录成功"})
            //将token保存到客户端的sessionStorage中
            window.sessionStorage.setItem("token", result.data.token)
            //跳转home页面
            this.$router.push("/home")
          }

        })
      }
    }
  }
</script>

<style scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
}

  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .logo {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .logo img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .button {
    display: flex;
    justify-content: flex-end;
  }
</style>
