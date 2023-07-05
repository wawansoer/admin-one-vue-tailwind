// import Vue from "vue";
// import { AclCreate, AclInstaller, AclRule } from "vue-acl";
// import router from "@/router";

// Vue.use(AclInstaller);

// let initialRole = "all";
// if (localStorage.getItem("userRole"))
//     initialRole = localStorage.getItem("userRole");

// export default new AclCreate({
//     initial: initialRole,
//     notfound: "/pages/not-authorized",
//     router,
//     acceptLocalRules: true,
//     globalRules: {
//         root: new AclRule("root").generate(),
//         administrator: new AclRule("administrator").generate(),
//         root_admin: new AclRule("root").or("administrator").generate(),
//     },
// });
