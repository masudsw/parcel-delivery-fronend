import CancelParcel from "@/pages/sender/CancelParcel";
import { CreateParcel } from "@/pages/sender/CreateParcel";
import MyParcels from "@/pages/sender/MyParcels";


import type { ISidebarItem } from "@/types";

export const senderSidebarItems: ISidebarItem[] = [
    {
        title: "Services for sender",

        items: [
            {
                title: "Send Parcel",
                url: "/sender/create-parcel",
                component: CreateParcel
            },
            {
                title: "My Parcel",
                url: "/sender/my-parcel",
                component: MyParcels
            },
            
        ],
    },
]