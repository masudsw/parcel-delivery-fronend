import { Button } from "@/components/ui/button";
import { currentStatus } from "@/constants/parcelStatus";
import { useGetAllParcelsQuery, useMarkInTransitMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect } from "react";
import type { IParcel } from "@/types";


export default async function MarkTransit() {
  const { data, isLoading, error } = await useGetAllParcelsQuery({
    currentStatus: currentStatus.PICKED
  });
  useEffect(() => {
    if (isLoading) toast.loading("Loading parcels...");
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error("Error loading parcel data");
  }, [error]);
  const [transitParcel] = useMarkInTransitMutation();
 
  const handleTransitClick = async (parcel: IParcel) => {
    if (!parcel) return;
    try {
      await transitParcel(
        // trackingNumber: selectedParcel.trackingId || selectedParcel._id as string,
        parcel.trackingId
      ).unwrap();
      toast.success("Parcel send for trasportation!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send transportation");
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
                <Button onClick={() => handleTransitClick(parcel)}>Send to trasportation</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.data?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No requested parcels found.
        </div>
      )}

      {/* Pick Parcel Dialog */}

    </div>
  );
}