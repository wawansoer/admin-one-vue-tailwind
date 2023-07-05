import { createRouter, createWebHashHistory } from "vue-router";
import Style from "@/views/StyleView.vue";
import Home from "@/views/HomeView.vue";
import auth from "@/auth/authService";
// import 'firebase/auth'
import AuthAPI from "@/network/api/AuthAPI"
import axios from 'axios'
import { url } from "@/configs/apiUrl";

const routes = [
  // {
  //   meta: {
  //     title: "Select style",
  //   },
  //   path: "/",
  //   name: "style",
  //   component: Style,
  // },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
  {
    meta: {
      title: "Callback",
    },
    path: "/callback",
    name: "authCallback",
    component: () => import("@/views/pages/auth/Callback.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (auth.isAuthenticated() && to.path !== '/login') {
    //validate session
    try {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      axios.post(url.adonis.auth.validatesession, {}, { headers: { 'Authorization': `Bearer ${userInfo.access_token.token}` } }).then(resp => {
        if (resp.data.message_code !== "VALID_SESSION") {
          localStorage.clear();
          router.push('/login')
        } else {
          if (localStorage.getItem('sessID' === null)) {
            localStorage.setItem('sessID', resp.data.data.id)
          }

          if (localStorage.getItem('sessID') != resp.data.data.id) {
            localStorage.setItem('sessID', resp.data.data.id)
          }
          let isChange = false
          let role = localStorage.getItem('userRole')
          if (role !== undefined && (role !== "root" ||
            role !== "administrator" ||
            role !== "issuer_user" ||
            role !== "aino_finance" ||
            role !== "aino_cc" ||
            role !== "aino_recon" ||
            role !== "aino_recon_child" ||
            role !== "aino_pios" ||
            role !== "customer_service")) {
            AuthAPI.UserInfo(null).then((result) => {
              if (result.data !== null) {
                for (let merchant of result.data.merchant) {
                  if (merchant.parent_id === 0) {
                    if (merchant.status === "active") {
                      if (role !== result.data.roles[0]) {
                        isChange = true
                      }

                      role = result.data.roles[0]
                    } else {
                      if (role !== "unverified_merchant") {
                        isChange = true
                      }

                      role = "unverified_merchant"
                    }

                    localStorage.setItem('userRole', role);
                    if (isChange) {
                      window.location.reload()
                    }
                  }
                }
              }
            })
          }
        }
      }).catch(e => {
        console.log("Error while validating session")
        console.log(e)
        localStorage.clear();
        router.push('/login')
      })
    } catch (e) {
      console.log("Error while validating session")
      console.log(e)
      localStorage.clear();
      router.push('/login')
    }
  }

  if ((to.path === "/login" || to.path === "/register") && auth.isAuthenticated()) {
    let isContinueRedirect = (to.query.continue === undefined) ? false : true
    //validate session
    try {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      axios.post(url.adonis.auth.validatesession, {}, { headers: { 'Authorization': `Bearer ${userInfo.access_token.token}` } }).then(resp => {
        if (resp.data.message_code !== "VALID_SESSION") {
          localStorage.clear();
          if (isContinueRedirect) return next()
          else router.push('/login')
        } else {
          if (isContinueRedirect) return next()
          else router.push({ path: '/home' })
        }
      }).catch(e => {
        console.log("Error while validating session")
        console.log(e)
        localStorage.clear();
        if (isContinueRedirect) return next()
        else router.push('/login')
      })

    } catch (e) {
      console.log("Error while validating session")
      console.log(e)
      localStorage.clear();
      if (isContinueRedirect) return next()
      else router.push('/login')
    }
  }

  if (
    to.path === "/login" ||
    to.path === "/forgot-password" ||
    to.path === "/register" ||
    to.path === "/callback" ||
    to.path === "/error/comingsoon" ||
    to.path === "/error/error-404" ||
    to.path === "/error/error-500" ||
    (auth.isAuthenticated())
  ) {
    let uRole = localStorage.getItem("userRole");
    if (to.path === '/home' && (uRole === 'root' || uRole === 'administrator' || uRole === 'aino_finance' || uRole === 'aino_recon' || uRole === 'aino_recon_child' || uRole === 'aino_cc')) {
      router.push('/merchant')
    } else if (to.path === '/home' && (uRole === 'issuer_user' || uRole === 'aino_pios' || uRole === 'customer_service')) {
      router.push('/services')
    }
    return next();
  }
  router.push({ path: '/login', query: { to: to.path } })
})

export default router;
