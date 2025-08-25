import CancelParcel from "@/pages/sender/CancelParcel";
import { CreateParcel } from "@/pages/sender/CreateParcel";

import UndateParcel from "@/pages/sender/UndateParcel";
import type { ISidebarItem } from "@/types";

export const senderSidebarItems:ISidebarItem[]=[
    {
      title: "Services for sender",
     
      items: [
        {
          title: "Send Parcel",
          url: "/sender/create-parcel",
          component:CreateParcel
        },
        {
          title: "Update Parcel",
          url: "/sender/update-parcel",
          component: UndateParcel
        },
        {
          title: "Cancel Parcel",
          url: "/sender/cancel-parcel",
          component: CancelParcel
        },
      ],
    },
  ]