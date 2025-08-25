import { userTypes } from "@/constants/userTypes";
import type { TUserType } from "@/types";

import {adminSidebarItems} from "@/routes/adminSidebarItems"
import { senderSidebarItems } from "@/routes/senderSidebarItems";
import {receiverSidebarItems} from "@/routes/receiverSidebarItems"
export const getSidebarItems=(userType: TUserType)=>{
    switch(userType){
        case userTypes.ADMIN:
            return [...adminSidebarItems]
        case userTypes.SENDER:
            return [...senderSidebarItems]
        case userTypes.RECEIVER:
            return [...receiverSidebarItems]
    }
}