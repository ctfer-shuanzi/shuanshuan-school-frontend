<template>
  <div id="login-container">
    <div class="background-decoration"></div><!-- 背景装饰层 -->
    <el-container>
      <el-header>
        <h1>栓栓教务系统</h1>
      </el-header>
      <el-main>
        <div class="login-card"><!-- 登录卡片 -->
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form" @keydown.enter="handleLogin" >
            <div class="form-title">用户登录</div>
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" placeholder="请输入密码" show-password prefix-icon="Lock"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" @click="handleLogin" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</el-button>
            </el-form-item>
          </el-form>
          <p>还没账号？<router-link to="/register">立即注册</router-link></p>
        </div>
      </el-main>
      <el-footer>
        <p>栓栓教务系统 © 2025 Created by 栓栓</p>
        <p><a href="https://cybersec.hubu.edu.cn/" target="_blank">网络空间安全学院</a></p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
});

// 表单验证规则
const loginRules = ref({
  username: [
    { required: true, message: '您还未输入用户名', trigger: 'blur' }// 验证规则：必填，否则离开时提示'您还未输入用户名'
  ],
  password: [
    { required: true, message: '您还未输入密码', trigger: 'blur' }// 验证规则：必填，否则离开时提示'您还未输入密码'
  ]
});

// 表单引用
const loginFormRef = ref(null);

// 登录状态
const loading = ref(false);

// 登录处理函数
const handleLogin = () =>{
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // 登录请求
        const response = await axios.post('http://localhost:8080/account/login',loginForm.value);
        if(response.data.code === 200){
          ElMessage.success(response.data.message);
          router.push('/home'); // 登录成功后跳转到主页面
        }else if(response.data.code === 1001){
          ElMessage.error(response.data.message);// 用户不存在，跳转到注册页面
          router.push('/register');
        }else if(response.data.code === 1002){
          ElMessage.error(response.data.message);// 用户名或密码错误
        }else{
          ElMessage.error('登录失败');// 其他异常情况
        }
      } catch (error) {
        ElMessage.error('登录失败，出现异常');
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.warning('请完善表单信息');
    }
  });
}
</script>

<style scoped>
#login-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e6f7ff 0%, #d1eaff 100%);
  z-index: -1;
}

.el-header {
  background-color: #165DFF;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.el-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;
  padding: 20px;
}

/* 登录卡片样式 */
.login-card {
  width: 100%;
  max-width: 400px;
  background: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.form-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
}

.login-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  height: 45px;
}

.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
}

.el-footer {
  background-color: #f5f7fa;
  color: #666;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 15%;
  font-size: 14px;
}

.el-footer a {
  color: #7196ee;
  text-decoration: none;
}

.el-footer a:hover {
  text-decoration: underline;
}
</style>