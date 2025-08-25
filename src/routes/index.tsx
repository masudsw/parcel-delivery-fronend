import App from "@/App";
import DashboardLayout from "@/components/DashboardLayout";
import { userType } from "@/constants/userType";
import About from "@/pages/About";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import Unauthorized from "@/pages/Authentication/Unauthorized";
import { Verify } from "@/pages/Authentication/Verify";
import Homepage from "@/pages/home/Homepage";
import TrackParcel from "@/pages/TrackParcel";
import type { TUserType } from "@/types";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter } from "react-router-dom";


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
        Component: withAuth(DashboardLayout,userType.ADMIN as TUserType) ,
        path:"/admin",
        children:[

            
        ]
    },
    {
        Component: withAuth(DashboardLayout, userType.SENDER as TUserType),
        path:"sender",
        children:[

        ]

    },
    {
        Component:withAuth(DashboardLayout, userType.RECEIVER as TUserType),
        path:"receiver",
        children:[

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
   

]
    

)