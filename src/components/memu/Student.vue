<template>
  <!-- 每页条数设置区域 - 绑定回车事件触发查询 -->
  <div id="choose-page-size" @keydown.enter="changeLimit">
    <el-form-item prop="limit" label="每页显示条数">
      <!-- 每页条数输入框 - 双向绑定修改后的值，提供占位提示 -->
      <el-input 
        type="text" 
        label="每页记录数量" 
        v-model="changedLimit" 
        placeholder="在这里修改每页记录的数量...（请输入正整数）"
      />
    </el-form-item>
    <el-form-item>
      <!-- 查询按钮 - 触发每页条数更新和数据刷新 -->
      <el-button type="primary" @click="changeLimit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <!-- 刷新按钮 - 重新获取当前页数据 -->
      <el-button type="warning" @click="fetchTableData">刷新</el-button>
    </el-form-item>
    <el-form-item>
      <!-- 取消按钮 - 跳转回首页 -->
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
    <el-form-item>
      <!-- 添加学生按钮 - 预留添加功能入口 -->
      <el-button type="primary" @click="addStudent">
        <el-icon><Plus /></el-icon>添加学生
      </el-button>
    </el-form-item>
    <!-- 展示表格总记录数 - 实时更新 -->
    <span>表格总记录数：{{ total }}</span>
  </div>

  <!-- 表格展示区域 -->
  <div id="table">
    <el-table 
      :data="filteredTableData"  <!-- 绑定筛选后的表格数据 -->
      style="width: 100%" 
      v-loading="loading"        <!-- 加载状态提示 -->
    >
      <!-- 学号列 - 绑定prop字段 -->
      <el-table-column prop="number" label="学号" />
      <!-- 姓名列 - 绑定prop字段 -->
      <el-table-column prop="name" label="姓名" />
      <!-- 性别列 - 绑定prop字段 -->
      <el-table-column prop="sex" label="性别" />
      <!-- 年龄列 - 绑定prop字段 -->
      <el-table-column prop="age" label="年龄" />
      <!-- 专业列 - 绑定prop字段 -->
      <el-table-column prop="major" label="专业" />
      <!-- 操作列 - 自定义表头（搜索框）和表体（编辑/删除按钮） -->
      <el-table-column align="right">
        <template #header>
          <!-- 表格头部搜索框 - 双向绑定搜索关键词，支持清空 -->
          <el-input 
            size="small" 
            placeholder="输入学生姓名进行搜索..." 
            v-model="searchQuery"
            clearable
          />
        </template>
        <template #default="scope">
          <!-- 编辑按钮 - 传递当前行索引和数据 -->
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <!-- 删除按钮 - 传递当前行索引和数据 -->
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页组件区域（最终版） -->
  <div id="page" style="margin-top: 20px; text-align: right;">
    <el-pagination
      background
      
      layout="prev, pager, next, jumper, ->, total"  
      :total="total"             
      :current-page="currentPage"
      :page-size="limit"         
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup>
// 导入Vue核心API：ref(响应式变量)、computed(计算属性)、onMounted(挂载钩子)
import { ref, computed, onMounted } from 'vue';
// 导入axios用于发送AJAX请求
import axios from 'axios';
// 导入Element Plus的消息提示组件，用于用户反馈
import { ElMessage } from 'element-plus';
// 导入Vue Router的路由跳转方法
import { useRouter } from 'vue-router';
// 导入Element Plus的图标组件
import { Plus, Edit, Delete } from '@element-plus/icons-vue';

// 初始化路由实例 - 用于页面跳转
const router = useRouter();

/************************ 响应式变量定义 ************************/
// 搜索关键词 - 绑定表格头部搜索框
const searchQuery = ref('');
// 表格加载状态 - 控制v-loading显示/隐藏
const loading = ref(false);
// 原始表格数据 - 存储从后端获取的分页数据
const tableData = ref([]);
// 学生表单数据 - 用于编辑学生信息（预留）
const student = ref({
  number: '',
  name: '',
  sex: '',
  age: '',
  major: ''
});
// 表格总记录数 - 从后端获取，用于计算总页数
const total = ref(0);
// 当前页号 - 绑定分页组件，默认第1页
const currentPage = ref(1);
// 每页显示条数 - 默认10条，绑定分页组件
const limit = ref(10);
// 用户修改后的每页显示条数 - 绑定输入框，默认与limit保持一致
const changedLimit = ref(10);

/************************ 分页相关方法 ************************/
/**
 * 每页显示条数变化时触发（分页组件/查询按钮触发）
 * @param {Number} size - 新的每页显示条数
 */
const handleSizeChange = (size) => {
  // 容错处理：避免无效值赋值给limit
  const validSize = Number(size);
  if (!isNaN(validSize) && validSize > 0) {
    limit.value = validSize;
    console.log("当前每页显示条数更新为:", limit.value);
  } else {
    ElMessage.warning("每页显示条数必须为正整数");
  }
};

/**
 * 页码切换时触发（分页组件点击页码触发）
 * @param {Number} page - 新的页码
 */
const handleCurrentChange = (page) => {
  currentPage.value = page;
  console.log("当前页码更新为:", currentPage.value);
  // 切换页码后，重新请求对应页码的数据
  fetchTableData();
};

/**
 * 点击查询按钮触发 - 应用用户输入的每页显示条数
 */
const changeLimit = () => {
  // 调用handleSizeChange更新每页条数（包含容错处理）
  handleSizeChange(changedLimit.value);
  // 重新请求数据，应用新的每页条数
  fetchTableData();
  // 同步输入框与limit值，避免输入框残留无效值
  changedLimit.value = limit.value;
};

/************************ 页面操作方法 ************************/
/**
 * 点击取消按钮触发 - 跳转回首页
 */
const onCancel = () => {
  router.push('/home');
};

/**
 * 点击添加学生按钮触发 - 预留添加功能（当前仅打印日志）
 */
const addStudent = () => {
  console.log("准备添加学生");
  ElMessage.info("添加学生功能待实现");
};

/************************ 数据请求方法 ************************/
/**
 * 从后端获取表格分页数据（核心数据请求方法）
 * 异步函数 - 使用async/await处理Promise请求
 */
const fetchTableData = async () => {
  // 开启加载状态
  loading.value = true;
  try {
    // 构造分页请求参数
    const pageParams = {
      currentPage: currentPage.value,
      limit: limit.value
    };
    // 发送POST请求到后端分页接口
    const response = await axios.post('http://localhost:8080/student/page', pageParams);
    
    // 后端返回成功（约定code=200为成功）
    if (response.data.code === 200) {
      // 赋值表格数据，更新视图
      tableData.value = response.data.data;
      console.log("表格数据获取成功:", tableData.value);
    } else {
      // 后端返回业务提示信息
      ElMessage.info(response.data.message || "获取数据无结果");
    }
  } catch (error) {
    // 捕获网络错误、接口报错等异常
    console.error('获取表格数据失败:', error);
    ElMessage.error('获取数据失败，请检查后端接口是否正常运行');
  } finally {
    // 无论成功/失败，最终关闭加载状态
    loading.value = false;
  }
};

/**
 * 从后端获取表格总记录数
 * 用于计算总页数，实现分页组件的最大页码限制
 */
const getTotalRecordsNum = async () => {
  try {
    // 发送GET请求获取总记录数
    const response = await axios.get('http://localhost:8080/student/total');
    if (response.data.code === 200) {
      // 赋值总记录数，用于计算总页数
      total.value = response.data.data;
      console.log("表格总记录数获取成功:", total.value);
    } else {
      ElMessage.info(response.data.message || "获取总记录数无结果");
    }
  } catch (error) {
    console.error('获取总记录数失败:', error);
  }
};

/**
 * 计算属性：根据搜索关键词筛选表格数据
 * 自动响应searchQuery（搜索关键词）和tableData（原始数据）的变化
 * 实现表格的实时搜索筛选功能
 */
const filteredTableData = computed(() => {
  console.log('开始筛选表格数据...');
  
  // 容错处理：确保tableData是数组，避免报错
  if (!Array.isArray(tableData.value)) {
    console.error('表格原始数据不是有效数组:', tableData.value);
    return [];
  }
  
  // 无搜索关键词时，直接返回原始表格数据
  if (!searchQuery.value) {
    return tableData.value;
  }
  
  // 统一转换为小写，实现不区分大小写的搜索
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  
  // 数组筛选：匹配学号、姓名、性别、年龄、专业字段
  return tableData.value.filter(item => {
    // 容错处理：确保当前项是有效对象
    if (!item || typeof item !== 'object') return false;
    
    // 多字段匹配逻辑，满足任一字段即返回该条数据
    return (item.number && item.number.toString().toLowerCase().includes(lowerCaseQuery)) ||
           (item.name && item.name.toLowerCase().includes(lowerCaseQuery)) ||
           (item.sex && item.sex.toLowerCase().includes(lowerCaseQuery)) ||
           (item.age && item.age.toString().includes(lowerCaseQuery)) ||
           (item.major && item.major.toLowerCase().includes(lowerCaseQuery));
  });
});

/************************ 表格操作方法 ************************/
/**
 * 编辑学生信息（当前仅打印日志，预留后续完善）
 * @param {Number} index - 当前行索引
 * @param {Object} row - 当前行数据
 */
const handleEdit = (index, row) => {
  console.log('进入编辑模式 - 索引:', index, '学生数据:', row);
  // 深拷贝当前行数据到学生表单，避免直接修改原始数据
  student.value = { ...row };
  ElMessage.info(`准备编辑学生：${row.name}`);
};

/**
 * 删除学生信息（前端临时删除，建议后续对接后端删除接口）
 * @param {Number} index - 当前行索引
 * @param {Object} row - 当前行数据
 */
const handleDelete = (index, row) => {
  console.log('触发删除操作 - 索引:', index, '学生数据:', row);
  
  // 弹出确认框，防止误操作
  if (confirm(`确定要永久删除学生 ${row.name} 吗？此操作不可恢复！`)) {
    // 查找当前学生在原始数据中的索引
    const deleteIndex = tableData.value.findIndex(item => item.number === row.number);
    if (deleteIndex > -1) {
      // 从原始数据中删除该学生（前端临时删除）
      tableData.value.splice(deleteIndex, 1);
      // 同步更新总记录数（前端临时更新，建议后端删除成功后返回最新总条数）
      total.value -= 1;
      // 提示删除成功
      ElMessage.success(`学生 ${row.name} 删除成功`);
      // 重新请求数据，确保数据与后端保持一致（可选，根据业务需求）
      // fetchTableData();
    } else {
      ElMessage.warning("未找到该学生数据，删除失败");
    }
  }
};

/************************ 初始化方法 ************************/
/**
 * 组件初始化逻辑 - 统一管理初始化需要执行的方法
 */
const init = () => {
  // 1. 获取表格总记录数（用于计算总页数）
  getTotalRecordsNum();
  // 2. 获取初始分页数据（默认第1页，每页10条）
  fetchTableData();
};

/************************ 组件生命周期 ************************/
/**
 * 组件挂载完成后触发（Vue的onMounted钩子）
 * 此时组件DOM已生成，适合执行数据初始化请求
 */
onMounted(() => {
  // 确保输入框初始值与每页条数保持一致
  changedLimit.value = limit.value;
  // 执行初始化逻辑
  init();
});
</script>

<style scoped>
/* 每页条数设置区域样式 - 弹性布局，底部间距 */
#choose-page-size{
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px; /* 增加元素之间的间距，提升美观度 */
}

/* 分页组件区域样式 - 顶部间距，右对齐 */
#page{
  margin-top: 20px;
  text-align: right;
}

/* 表格区域样式 - 边框轻微阴影，提升视觉效果 */
#table{
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}
</style>