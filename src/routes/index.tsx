import App from "@/App";
import About from "@/pages/About";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import Unauthorized from "@/pages/Authentication/Unauthorized";
import { Verify } from "@/pages/Authentication/Verify";
import Homepage from "@/pages/home/Homepage";
import TrackParcel from "@/pages/TrackParcel";
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