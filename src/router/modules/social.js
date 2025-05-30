import Layout from '@/layout'

export default {
    path: "/social",
    component: Layout,
    children: [
      {
        path: "index",
        name: "social_securitys",
        component: () => import("@/views/social/index"),
        meta: { title: "社保", icon: "table" },
      },
    ],
  }