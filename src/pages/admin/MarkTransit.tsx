import { Button } from "@/components/ui/button";
import { currentStatus } from "@/constants/parcelStatus";
import { useGetAllParcelsQuery, useMarkInTransitMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import type { IParcelBase } from "@/types";



export default function MarkTransit() {
  // Remove async/await from hooks - they're synchronous
  const { data, isLoading, error } = useGetAllParcelsQuery({
    currentStatus: currentStatus.PICKED
  });
  
  const [transitParcel] = useMarkInTransitMutation();
   const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Store the toast ID so we can dismiss it later
      toastIdRef.current = toast.loading("Loading parcels...");
    } else if (toastIdRef.current) {
      // Dismiss the loading toast when loading is complete
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error("Error loading parcel data");
  }, [error]);
 
  const handleTransitClick = async (parcel: IParcelBase) => {
    if (!parcel.trackingId) {
      toast.error("No tracking ID found");
      return;
    }
    
    try {
      // Assuming your API expects just the tracking ID
      await transitParcel(parcel.trackingId).unwrap();
      toast.success("Parcel sent for transportation!");
       /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send for transportation");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Picked Parcels waiting for transit</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Tracking ID</th>
            <th className="border border-gray-300 p-2 text-left">Receiver</th>
            <th className="border border-gray-300 p-2 text-left">Phone</th>
            <th className="border border-gray-300 p-2 text-left">Weight</th>
            <th className="border border-gray-300 p-2 text-left">Destination</th>
            <th className="border border-gray-300 p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((parcel) => (
            <tr key={parcel._id}>
              <td className="border border-gray-300 p-2">{parcel.trackingId}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverName}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverPhone}</td>
              <td className="border border-gray-300 p-2">{parcel.weight} kg</td>
              <td className="border border-gray-300 p-2">
                {parcel.destinationAddress.address}, {parcel.destinationAddress.district}
              </td>
              <td className="border border-gray-300 p-2">
                <Button onClick={() => handleTransitClick(parcel)}>
                  Send to transportation
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.data?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No picked parcels found waiting for transit.
        </div>
      )}
    </div>
  );
}