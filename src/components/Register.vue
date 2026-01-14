<template>
  <div id="register-container">
    <div class="background-decoration"></div><!-- 背景装饰层 -->
    <el-container>
      <el-header>
        <h1>栓栓教务系统</h1>
      </el-header>
      <el-main>
        <div class="register-card"><!-- 注册卡片 -->
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="register-form">
            <div class="form-title">用户注册</div>
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="User"></el-input>
            </el-form-item>
            <el-form-item prop="role">
                <el-select v-model="registerForm.role" placeholder="请选择你的角色">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="registerForm.password" placeholder="请输入密码" show-password prefix-icon="Lock"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input v-model="registerForm.confirmPassword" placeholder="请确认密码" show-password prefix-icon="Lock"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="register-btn" @click="handleRegister" :disabled="registering">{{ registering ? '注册中...' : '注册' }}</el-button>
            </el-form-item>
          </el-form>
          <p>已有账号？<router-link to="/">立即登录</router-link></p>
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
const registerForm = ref({
  username: '',
  role: '',
  password: '',
  confirmPassword: ''
});

const options = [
  { value: 'admin', label: '管理员' },
  { value: 'teacher', label: '教师' },
  { value: 'student', label: '学生' }
]

// 表单验证规则
const registerRules = ref({
  username: [
    { required: true, message: '您还未输入用户名', trigger: 'blur' }// 验证规则：必填，否则离开时提示'您还未输入用户名'
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '您还未输入密码', trigger: 'blur' }// 验证规则：必填，否则离开时提示'您还未输入密码'
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' }// 验证规则：必填，否则离开时提示'请再次输入密码'
  ]
});

// 表单引用
const registerFormRef = ref(null);

// 注册状态
const registering = ref(false);

// 注册处理函数
const handleRegister = () =>{
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      registering.value = true;
      try {
        // 注册请求
        const response = await axios.post('http://localhost:8080/account/register',registerForm.value);
        if(response.data.code === 200){
          ElMessage.success(response.data.message);
          router.push('/');// 注册成功后跳转到登录页面
        }else if(response.data.code === 1003){
          ElMessage.info(response.data.message);// 用户已存在，将自动跳转至登陆页面
          router.push('/');
        }else if(response.data.code === 1004){
          ElMessage.error(response.data.message);// 注册失败
        }else{
          ElMessage.error('注册异常');// 其他异常情况
        }
      } catch (error) {
        ElMessage.error('注册失败，请稍后重试。');
      } finally {
        registering.value = false;
      }
    } else {
      ElMessage.warning('请完善表单信息');
    }
  });
}
</script>

<style scoped>
#register-container {
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
.register-card {
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

.register-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  height: 45px;
}

.register-btn {
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