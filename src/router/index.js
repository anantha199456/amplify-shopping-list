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
        //So to get to the home page, this require Authentication so we added the Auth section here.
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
    base: process.env.BASE_URL,
    routes
});

//to enforce our authentication all the time
// multiple navigation guard functions (beforEeach) available to us

//refer below link to check on how to create Authentication Navigator aurd in Vue
//https://tenmilesquare.com/creating-an-authentication-navigation-guard-in-vue/
router.beforEeach(async(to, fro, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        try {
            await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser();
            next();
        } catch (error) {
            next({ path: "/" });

        }
    }
    next();
});



export default router;