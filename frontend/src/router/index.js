import {createRouter, createWebHistory} from 'vue-router'

import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import ObjectsView from '../views/ObjectsView.vue'
import DefectsView from '../views/DefectsView.vue'
import ReportsView from '../views/ReportsView.vue'
import UsersView from '../views/UsersView.vue'





const routes = [
    {path: '/', redirect: '/profile' },
    {path: '/login', component: LoginView },
    {
        path: '/profile', 
        component: ProfileView,
        meta: {requiresAuth: true} 
    },
        {
        path: '/objects', 
        component: ObjectsView,
        meta: {requiresAuth: true} 
    },
        {
        path: '/defects', 
        component: DefectsView,
        meta: {requiresAuth: true} 
    },
        {
        path: '/reports', 
        component: ReportsView,
        meta: {requiresAuth: true} 
    },
        {
        path: '/users', 
        component: UsersView,
        meta: {requiresAuth: true} 
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
    next('/profile')
    }
    else {
        next()
    }
});

export default router;