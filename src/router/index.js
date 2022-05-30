import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import DetailProduct from "@/components/Products/DetailProduct";
import Cart from "@/components/Cart/Cart";
import CreateOrder from "@/components/Orders/Create";
import InfoOrder from "@/components/Orders/Detail";
import ListOrder from "@/components/Orders/List";
import ClientsOrders from "@/components/Clients/Orders";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/detail-product/:id",
    name: "DetailProdut",
    component: DetailProduct,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/create-order",
    name: "CreateOrder",
    component: CreateOrder,
  },
  {
    path: "/list-orders",
    name: "ListOrder",
    component: ListOrder,
  },
  {
    path: "/info-payment-order/:id",
    name: "InfoOrder",
    component: InfoOrder,
  },
  {
    path: "/clinents-orders",
    name: "ClientsOrders",
    component: ClientsOrders,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
