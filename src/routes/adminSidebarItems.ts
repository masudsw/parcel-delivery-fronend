import MarkPick from "@/pages/admin/MarkPick";
import MarkTransit from "@/pages/admin/MarkTransit";
import ViewParcels from "@/pages/admin/ViewParcels";


import type { ISidebarItem } from "@/types";

export const adminSidebarItems:ISidebarItem[]=[
    {
      title: "Services for admin",
     
      items: [
        {
          title: "Pickup Parcel",
          url: "/admin/mark-pick",
          component:MarkPick
        },
        {
          title: "Mark as Transit",
          url: "/admin/mark-transit",
          component: MarkTransit
        },
        {
            title:"All Parcels",
            url:"/admin/all-parcels",
            component: ViewParcels
        }
        
      ],
    },
  ]