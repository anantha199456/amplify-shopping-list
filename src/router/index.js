import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Auth",
        component: Auth
    }, {
        path: "/home",
        name: "Home",
        component: Home,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/about",
        name: "About",
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async(to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser();
            next();
        } catch (e) {
            next({
                path: "/",
                query: {
                    redirect: to.fullPath
                }
            });
        }
    }
    next();
});



export default router;