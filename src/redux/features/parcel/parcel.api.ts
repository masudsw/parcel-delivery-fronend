import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IGetAllParcelsParams, IGetAllParcelsResponse, IParcelBase, IPickupData, ISenderParcel, IStatusLog, IStatusUpdateResponse } from "@/types/parcel.types";

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
        updateParcels: builder.mutation<IResponse<ISenderParcel[]>, { id: string; payload: Partial<ISenderParcel> }>({
            query: ({id,payload}) => ({
                url: `/parcel/${id}`,
                method: "patch",
                data:payload
            }),
           invalidatesTags: ["PARCEL"],
        }),

        // Mark parcel as picked up
        pickParcel: builder.mutation<IStatusUpdateResponse, { trackingId: string; data: IPickupData }>
            ({
                query: ({ trackingId, data }) => ({
                    url: `/parcel/${trackingId}/status/mark-picked`,
                    method: "PATCH",
                    data: data

                }),
                invalidatesTags: ["PARCEL"],
            }),

        // Mark parcel as in transit
        markInTransit: builder.mutation<IStatusUpdateResponse, string>({
            query: (trackingId) => ({
                url: `/parcel/${trackingId}/status/intransit`,
                method: "PATCH",
            }),
            invalidatesTags: ["PARCEL"],
        }),

        // Mark parcel as received

        receiveParcel: builder.mutation<IStatusUpdateResponse, { trackingId: string, receiverPhone: string }>({
            query: ({ trackingId, receiverPhone }) => ({
                url: `/parcel/${trackingId}/status/mark-received`,
                method: "PATCH",
                data: { receiverPhone }
            }),
            invalidatesTags: ["PARCEL"],
        }),

        // Get parcel status
        getParcelStatus: builder.query<IResponse<IStatusLog[]>, { trackingId: string }>({
            query: ({ trackingId }) => ({
                url: `/parcel/${trackingId}/status`,
                method: "GET",
            }),
            providesTags: ["PARCEL"],
        }),

        // Get all parcels with filtering and pagination   /my-parcel
        getAllParcels: builder.query<IGetAllParcelsResponse, IGetAllParcelsParams>({
            query: (params) => ({
                url: '/parcel',
                method: 'GET',
                params: params,
            }),
            providesTags: ["PARCEL"],
        }),

        getParcelToReceive: builder.query<IResponse<IParcelBase[]>, null>({
            query: () => ({
                url: '/parcel/ready-to-receive',
                method: "GET",
            }),
            providesTags: ["PARCEL"]
        }),

        // Cancel parcel
        cancelParcel: builder.mutation<IStatusLog[], { trackingId: string }>({
            query: ({ trackingId }) => ({
                url: `/parcel/${trackingId}/status/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["PARCEL"],
        }),

        // Get current user's parcels
        getMyParcels: builder.query<IResponse<ISenderParcel[]>, void>({
            query: () => ({
                url: "/parcel/my-parcel",
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
    useReceiveParcelMutation,
    useGetParcelStatusQuery,
    useLazyGetParcelStatusQuery,
    useGetAllParcelsQuery,
    useCancelParcelMutation,
    useGetMyParcelsQuery,
    useUserInfoQuery,
    useGetParcelToReceiveQuery,
    useUpdateParcelsMutation
} = parcelApi;