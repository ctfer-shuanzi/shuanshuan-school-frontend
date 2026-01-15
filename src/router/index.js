import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Account from '../components/memu/Account.vue';
import Student  from '../components/memu/Student.vue';
import Teacher from '../components/memu/Teacher.vue';
import Course from '../components/memu/Course.vue';
import Choose from '../components/memu/Choose.vue';


const routes = [
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/account',
                name: 'Account',
                component: Account
            },
            {
                path: '/student',
                name: 'Student',
                component: Student
            },
            {
                path: '/teacher',
                name: 'Teacher',
                component: Teacher
            },
            {
                path: '/course',
                name: 'Course',
                component: Course
            },
            {
                path: '/choose',
                name: 'Choose',
                component: Choose
            }
        ]
    },
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;