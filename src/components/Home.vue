<template>
  <!-- 整体布局容器，使用flex布局实现左右分栏 -->
  <div class="layout-container">
    
    <!-- 左侧菜单栏区域 -->
    <div class="sidebar">
      <!-- Element Plus 菜单组件 -->
      <!-- 
        :default-active - 默认激活的菜单项，绑定到activeIndex
        @select - 菜单选择事件，绑定handleSelect方法
        class - 自定义样式类
      -->
      <el-menu 
        :default-active="activeIndex" 
        @select="handleSelect"
        class="el-menu-vertical"
      >
        <!-- 主菜单分组 -->
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>主菜单</span>
          </template>
          <el-menu-item-group title="系统管理">
            <el-menu-item index="/home">系统主页</el-menu-item>
            <el-menu-item index="/logout">退出系统</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 账号管理分组 -->
        <el-sub-menu index="2">
          <template #title>
            <el-icon><User /></el-icon>
            <span>账号管理</span>
          </template>
          <el-menu-item-group title="增删">
            <el-menu-item index="/account/add">增加账号记录</el-menu-item>
            <el-menu-item index="/account/delete">删除账号记录</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="查询">
            <el-menu-item index="/account/query">查询账号信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="修改">
            <el-menu-item index="/account/update">修改账号信息</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 学生管理分组 -->
        <el-sub-menu index="3">
          <template #title>
            <el-icon><School /></el-icon>
            <span>学生管理</span>
          </template>
          <el-menu-item-group title="增删">
            <el-menu-item index="/student/add">增加学生记录</el-menu-item>
            <el-menu-item index="/student/delete">删除学生记录</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="查询">
            <el-menu-item index="/student/query">查询学生信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="修改">
            <el-menu-item index="/student/update">修改学生信息</el-menu-item>
          </el-menu-item-group>  
        </el-sub-menu>

        <!-- 教师管理分组 -->
        <el-sub-menu index="4">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>教师管理</span>
          </template>
          <el-menu-item-group title="增删">
            <el-menu-item index="/teacher/add">增加教师记录</el-menu-item>
            <el-menu-item index="/teacher/delete">删除教师记录</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="查询">
            <el-menu-item index="/teacher/query">查询教师信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="修改">
            <el-menu-item index="/teacher/update">修改教师信息</el-menu-item>
          </el-menu-item-group>  
        </el-sub-menu>

        <!-- 课程管理分组 -->
        <el-sub-menu index="5">
          <template #title>
            <el-icon><Notebook /></el-icon>
            <span>课程管理</span>
          </template>
          <el-menu-item-group title="增删">
            <el-menu-item index="/course/add">增加课程记录</el-menu-item>
            <el-menu-item index="/course/delete">删除课程记录</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="查询">
            <el-menu-item index="/course/query">查询课程信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="修改">
            <el-menu-item index="/course/update">修改课程信息</el-menu-item>
          </el-menu-item-group>  
        </el-sub-menu>

        <!-- 选课管理分组 -->
        <el-sub-menu index="6">
          <template #title>
            <el-icon><List /></el-icon>
            <span>选课管理</span>
          </template>
          <el-menu-item-group title="增删">
            <el-menu-item index="/sc/add">增加选课记录</el-menu-item>
            <el-menu-item index="/sc/delete">删除选课记录</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="查询">
            <el-menu-item index="/sc/query">查询选课信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="修改">
            <el-menu-item index="/sc/update">修改选课信息</el-menu-item>
          </el-menu-item-group>  
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- Vue Router 的路由视图出口 -->
      <!-- 所有子路由组件都会在这里渲染 -->
      <router-view />
      
      <!-- 默认欢迎页面（仅在访问根路径 '/' 时显示） -->
      <div v-if="$route.path === '/home'" class="welcome-page">
        <div class="avatar-container">
          <!-- 欢迎头像 -->
          <el-avatar :size="120" src="../assets/avatar2.png" />
          <h2>欢迎使用管理系统</h2>
          <p>请从左侧菜单选择功能</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入Vue相关API
import { ref, watch } from 'vue'
// 导入Vue Router相关hooks
import { useRouter, useRoute } from 'vue-router'
// 导入Element Plus图标组件
import { 
  Location,   // 位置图标 - 用于主菜单
  User,       // 用户图标 - 用于账号管理
  School,     // 学校图标 - 用于学生管理
  Avatar,     // 头像图标 - 用于教师管理
  Notebook,   // 笔记本图标 - 用于课程管理
  List        // 列表图标 - 用于选课管理
} from '@element-plus/icons-vue'

/*
 * 路由相关设置
 * ========================================
 */

// 获取路由实例，用于编程式导航（页面跳转）
const router = useRouter()

// 获取当前路由信息对象，包含路径、参数等信息
const route = useRoute()


/*
 * 响应式数据定义
 * ========================================
 */

// 当前激活的菜单项索引
// 类型为ref响应式引用，初始值为'/home'
// 这个值会与菜单的default-active属性绑定，控制哪个菜单项高亮
const activeIndex = ref('/home')


/*
 * 核心方法定义
 * ========================================
 */

/**
 * 处理菜单选择事件
 * @param {string} index - 被选择的菜单项的索引值（即路由路径）
 * @description 当用户点击菜单项时触发，负责处理路由跳转和特殊逻辑
 */
const handleSelect = (index) => {
  // 特殊处理：如果是退出系统菜单项
  if (index === '/logout') {
    // 清除本地存储中的token（模拟退出登录）
    localStorage.removeItem('token')
    // 跳转到登录页
    router.push('/')
    // 直接返回，不执行后续的路由跳转逻辑
    return
  }
  if(index === '/account/add'){
    router.push('/account/add')
    return 
  }
  
  // 常规菜单项处理：检查是否需要跳转（避免重复跳转相同路由）
  if (index !== route.path) {
    // 编程式导航到目标路由
    router.push(index)
  }
  
  // 更新当前激活的菜单索引为选中的菜单项
  activeIndex.value = index
}

/**
 * 根据当前路由更新激活状态的菜单项
 * @description 将当前路由路径设置为激活的菜单索引
 */
const updateActiveIndex = () => {
  // 将当前路由路径赋值给activeIndex，使菜单高亮与实际路由保持一致
  activeIndex.value = route.path
}


/*
 * 生命周期和监听器设置
 * ========================================
 */

/**
 * 使用watch监听路由变化
 * 第一个参数：要监听的数据源 - 当前路由的路径
 * 第二个参数：回调函数 - 当路由变化时执行
 * 第三个参数：配置选项 - immediate: true表示立即执行一次回调
 */
watch(
  // 监听当前路由路径的变化
  () => route.path,
  
  // 路由变化时的回调函数
  () => {
    // 调用更新激活状态的方法
    updateActiveIndex()
  },
  
  // 配置选项
  { 
    immediate: true  // 立即执行一次，确保组件初始化时状态正确
  }
)

/*
 * 说明：这里没有使用onMounted生命周期钩子，而是使用watch + immediate: true
 * 的原因是：
 * 1. watch可以持续监听路由变化，而onMounted只在组件挂载时执行一次
 * 2. immediate: true确保组件初始化时就执行一次状态更新
 * 3. 这样可以更好地处理浏览器的前进/后退操作，以及直接访问某个路由的情况
 */
</script>

<style scoped>
/* 整体布局容器样式 */
.layout-container {
  /* 使用flex布局 */
  display: flex;
  /* 高度占满整个视口 */
  height: 100vh;
}

/* 左侧边栏样式 */
.sidebar {
  /* 固定宽度250px */
  width: 250px;
  /* 深色背景色（Element Plus暗色主题色） */
  background-color: #001529;
  /* 允许垂直滚动 */
  overflow-y: auto;
}

/* 菜单组件样式 */
.el-menu-vertical {
  /* 移除右边框 */
  border-right: none;
  /* 高度占满父容器 */
  height: 100%;
}

/* 右侧主内容区域样式 */
.main-content {
  /* 占据剩余的所有空间 */
  flex: 1;
  /* 内边距 */
  padding: 20px;
  /* 浅灰色背景 */
  background-color: #f5f5f5;
  /* 允许垂直滚动 */
  overflow-y: auto;
  /* 相对定位，为绝对定位的子元素提供参考 */
  position: relative;
}

/* 欢迎页面容器样式 */
.welcome-page {
  /* 使用flex布局 */
  display: flex;
  /* 水平居中对齐 */
  justify-content: center;
  /* 垂直居中对齐 */
  align-items: center;
  /* 高度占满父容器 */
  height: 100%;
  /* 最小高度限制 */
  min-height: 500px;
}

/* 头像容器样式 */
.avatar-container {
  /* 文本居中 */
  text-align: center;
  /* 白色背景 */
  background: white;
  /* 内边距 */
  padding: 40px;
  /* 圆角边框 */
  border-radius: 10px;
  /* 阴影效果 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 欢迎标题样式 */
.avatar-container h2 {
  /* 上外边距 */
  margin-top: 20px;
  /* 文字颜色 */
  color: #333;
  /* 字体粗细 */
  font-weight: normal;
}

/* 欢迎描述文字样式 */
.avatar-container p {
  /* 上外边距 */
  margin-top: 10px;
  /* 文字颜色 */
  color: #666;
}

/* 响应式设计 - 针对小屏幕设备 */
@media (max-width: 768px) {
  /* 在小屏幕上减小侧边栏宽度 */
  .sidebar {
    width: 200px;
  }
  
  /* 在小屏幕上减小主内容区域内边距 */
  .main-content {
    padding: 10px;
  }
}
</style>