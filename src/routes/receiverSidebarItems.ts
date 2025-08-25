import ReceiveParcel from "@/pages/receiver/ReceiveParcel";
import type { ISidebarItem } from "@/types";

export const receiverSidebarItems:ISidebarItem[]=[
    {
      title: "Services of receiver",
     
      items: [
        {
          title: "Receive Parcel",
          url: "/receiver/receive-parcel",
          component:ReceiveParcel
        },
       
      ],
    },
  ]