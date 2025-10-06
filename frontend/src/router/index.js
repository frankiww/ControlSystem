import {createRouter, createWebHistory} from 'vue-router'

import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'


const routes = [
    {path: '/', redirect: '/profile' },
    {path: '/login', component: LoginView },
    {
        path: '/profile', 
        component: ProfileView,
        meta: {requiresAuth: true} },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
});

export default router;