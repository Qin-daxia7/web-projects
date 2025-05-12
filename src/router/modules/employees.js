import Layout from "@/layout";
export default {
  path: "/employees",
  component: Layout,
  children: [
    {
      path: "index",
      name: "employees",
      component: () => import("@/views/employees/index"),
      meta: { title: "员工", icon: "people" },
    },
    {
      path: "detail/:id",
      component: () => import("@/views/employees/UserDetails.vue"),
      hidden: true,
      meta: { title: "员工详情" },
    },
  ],
};
