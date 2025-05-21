import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home"
import Admin from "../pages/admin/Admin";
import Ceo from "../pages/ceo/Ceo";
import App from "../App";
import Inventory from "../pages/admin/Inventory";
import OrderList from "../pages/admin/OrderList";
import Order from "../pages/admin/Order";
import Code from "../pages/ceo/Code";
import Product from "../pages/ceo/Product";
import Store from "../pages/ceo/Store";
import Post from "../pages/ceo/Post";
import PostDetail from "../pages/ceo/PostDetail";
import PostUpdateForm from "../pages/ceo/PostUpdateForm";
import PostForm from "../pages/ceo/PostForm";
import OrderDetail from "@/pages/ceo/OrderDetail";
import CeoOrder from "@/pages/ceo/Order";
import OrderSale from "../pages/ceo/OrderSale";
import ViewSale from "../pages/ceo/ViewSale";
import Class from "@/pages/admin/Class";
import StudentList from "@/pages/admin/StudentList";
import ClassCalendar from "@/pages/admin/ClassCalendar";
import SalesManage from "@/pages/admin/SalesManage";
import SalesStatus from "@/pages/admin/SalesStatus";
import TeacherList from "@/pages/admin/TeacherList";
import AdminPostList from "@/pages/admin/AdminPostList";
import AdminPostDetail from "@/pages/admin/AdminPostDetail";


const routes = [
    {path: '/', element: <Home />},
    {path: '/admin', element: <Admin />},
    {path: '/ceo', element: <Ceo />},
    {path: '/admin/inventory', element: <Inventory/>},
    {path: '/admin/order-list', element: <OrderList/>},
    {path: '/admin/order', element: <Order/>},
    {path: '/admin/:id/order', element: <Order/>},
    {path: '/ceo/code', element:<Code/>},
    {path: '/ceo/product', element:<Product/>},
    {path: '/ceo/store', element:<Store/>},
    {path: '/posts', element:<Post/>},
    {path: '/posts/new', element:<PostForm/>},
    {path: '/posts/:postId', element:<PostDetail/>},
    {path: '/posts/:postId/edit', element:<PostUpdateForm/>},

    {path: '/ceo/orders', element:<CeoOrder/>},
    {path: '/ceo/orders/:orderId/detail', element:<OrderDetail/>},

    {path: '/ceo/ordersale', element:<OrderSale/>},
    {path: '/ceo/viewsale', element:<ViewSale/>},
    {path: '/admin/class', element:<Class/>},
    {path: '/admin/notice', element:<AdminPostList/>},
    {path: '/admin/notice/:postId', element:<AdminPostDetail/>},
    {path: '/admin/students', element:<StudentList/>},
    {path: '/admin/teachers', element:<TeacherList/>},
    {path: '/admin/calendar', element:<ClassCalendar/>},
    {path: '/admin/salesmanage', element:<SalesManage/>},
    {path: '/admin/salesstat', element:<SalesStatus/>}
]

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: routes.map((route)=>{
        return {
            index: route.path === "/", 
            path: route.path === "/" ? undefined : route.path,
            element: route.element 
        }
    })
}])

export default router;