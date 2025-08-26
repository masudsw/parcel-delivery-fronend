import App from "@/App";
import DashboardLayout from "@/components/DashboardLayout";
import { userTypes } from "@/constants/userTypes";
import About from "@/pages/About";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import Unauthorized from "@/pages/Authentication/Unauthorized";
import { Verify } from "@/pages/Authentication/Verify";
import Homepage from "@/pages/home/Homepage";
import TrackParcel from "@/pages/TrackParcel";
import type { TUserType } from "@/types";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { generateRoutes } from "@/utils/generateRoutes";
import { senderSidebarItems } from "./senderSidebarItems";
import { adminSidebarItems } from "./adminSidebarItems";
import { receiverSidebarItems } from "./receiverSidebarItems";


export const router=createBrowserRouter([
    {
        Component:App,
        path:"/",
        children:[
            {
                Component:Homepage,
                index:true,
            },
            {
                Component:About,
                path:"about"
            },
            {
                Component:TrackParcel,
                path:"track-parcel"
            }
        ]
    },
    {
        Component: withAuth(DashboardLayout,userTypes.ADMIN as TUserType) ,
        path:"/admin",
        children:[
            {index:true, element:<Navigate to="/admin/all-parcels"/>},
            ...generateRoutes(adminSidebarItems)  
        ]
    },
    {
        Component: withAuth(DashboardLayout, userTypes.SENDER as TUserType),
        path:"sender",
        children:[
            {index:true, element:<Navigate to="/sender/create-parcel"/>},
            ...generateRoutes(senderSidebarItems)  

        ]
    },
    {
        Component:withAuth(DashboardLayout, userTypes.RECEIVER as TUserType),
        path:"receiver",
        children:[
            {index:true, element:<Navigate to="/receiver/receive-parcel"/>},
            ...generateRoutes(receiverSidebarItems)

        ]
    },
    {
        Component:Login,
        path:"/login"
    },
    {
        Component:Register,
        path:"/register"
    },
    {
        Component:Unauthorized,
        path:"/unauthorized"
    },
    {
        Component:Verify,
        path:"/verify"
    },
    {
        Component:DashboardLayout,
        path:"/dashboard"

    }
   

]
    

)