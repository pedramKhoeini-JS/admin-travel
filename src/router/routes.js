const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/ApplyRequests.vue") , meta: { title: "Apply Requests" } },
      { path: "/test", component: () => import("pages/Index.vue") , meta: { title: "Test" } }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
