<template>
    <el-form 
    :model="account" 
    label-width="auto" 
    :rules="formRules" 
    ref="formRef">
        <el-form-item prop="username" label="用户名">
            <el-input type="text" v-model="account.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="account.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="role" label="角色">
            <el-select v-model="account.role" placeholder="选择你的角色">
                <el-option label="管理员" value="admin"></el-option>
                <el-option label="教师" value="teacher"></el-option>
                <el-option label="学生" value="student"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 在 <script setup> 中，定义的变量会自动暴露给模板，无需 return
const account = ref({
  username: '',
  password: '',
  role: ''
}); 

const formRules = ref({
  username: [
    { required: true, message: '您还未输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '您还未输入密码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '您还未选择角色', trigger: 'change' }
  ]
});

const formRef = ref(null);

const onCancel = () => {
    router.push('/home');
}
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const response = await axios.post('http://localhost:8080/account/register', account.value);
          if (response.data.code === 200) {
            ElMessage.success(response.data.message || '添加成功');
            Object.keys(account.value).forEach(key => {
              account.value[key] = '';
            });
          } else {
            ElMessage.error(response.data.message || '添加失败');
          }
        } catch (error) {
            console.error('请求错误:', error);
            if (error.response?.data?.message) {
                ElMessage.error(error.response.data.message);
            } else {
                ElMessage.error('网络错误，请稍后重试');
            }
        }
      } else {
        ElMessage.warning('表单验证失败，请检查');
      }
    });
}
</script>

<style>

</style>