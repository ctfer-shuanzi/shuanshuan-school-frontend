import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AddAccount from '../components/memu/AddAccount.vue';

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/account/add',
                name: 'AddAccount',
                component: AddAccount
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