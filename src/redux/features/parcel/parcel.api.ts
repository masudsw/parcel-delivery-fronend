import { baseApi } from "@/redux/baseApi";
import type {IResponse } from "@/types";
import type { IAdminParcel, IGetAllParcelsParams, IParcelBase, IPickupData, ISenderParcel, IStatusUpdateResponse } from "@/types/parcel.types";



export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create new parcel
    createParcel: builder.mutation<IResponse<ISenderParcel>, ISenderParcel>({
      query: (parcelInfo) => ({
        url: "/parcel/newparcel",
        method: "POST",
        data: parcelInfo,
      }),
      invalidatesTags: ["PARCEL"],
    }),

    // Mark parcel as picked up
    pickParcel: builder.mutation<IStatusUpdateResponse, { trackingId: string; data: IPickupData }>
    ({
      query: ({trackingId,data} ) => ({
        url: `/parcel/${trackingId}/status/mark-picked`,
        method: "PATCH",
        data:data
       
      }),
      invalidatesTags: ["PARCEL"],
    }),

    // Mark parcel as in transit
    markInTransit: builder.mutation<IStatusUpdateResponse, IAdminParcel>({
      query: (trackingId) => ({
        url: `/parcel/${trackingId}/status/intransit`,
        method: "PATCH",
      }),
      invalidatesTags: ["PARCEL"],
    }),

    // Mark parcel as received
    markReceived: builder.mutation<IStatusUpdateResponse,IAdminParcel>({
      query: ({ trackingId,receiverPhone }) => ({
        url: `/parcel/${trackingId}/status/mark-received`,
        method: "PATCH",
        data:receiverPhone
      }),
      invalidatesTags: ["PARCEL"],
    }),

    // Get parcel status
    getParcelStatus: builder.query<IResponse<IParcelBase>, { trackingNumber: string }>({
      query: ({ trackingNumber }) => ({
        url: `/parcel/${trackingNumber}/status`,
        method: "GET",
      }),
      providesTags: ["PARCEL"],
    }),

    // Get all parcels with filtering and pagination
getAllParcels: builder.query<IResponse<IParcelBase[]>, IGetAllParcelsParams>({
  query: (params) => ({
    url: '/parcel',
    method: 'GET',
    params: params, 
  }),
  providesTags: ["PARCEL"],
}),

    // Cancel parcel
    cancelParcel: builder.mutation<IStatusUpdateResponse, { trackingNumber: string }>({
      query: ({ trackingNumber }) => ({
        url: `/parcel/${trackingNumber}/status/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["PARCEL"],
    }),

    // Get current user's parcels
    getMyParcels: builder.query<IResponse<ISenderParcel[]>, void>({
      query: () => ({
        url: "/parcel/myparcel",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
    }),

    // Get user info
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
    }),
  }),
});

export const {
  useCreateParcelMutation,
  usePickParcelMutation,
  useMarkInTransitMutation,
  useMarkReceivedMutation,
  useGetParcelStatusQuery,
  useGetAllParcelsQuery,
  useCancelParcelMutation,
  useGetMyParcelsQuery,
  useUserInfoQuery,
} = parcelApi;