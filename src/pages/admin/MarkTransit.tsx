import { useState } from "react";
import { Button } from "@/components/ui/button";

import { currentStatus } from "@/constants/parcelStatus";
import { useGetAllParcelsQuery, useMarkInTransitMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect } from "react";

import z from "zod";
import type { IParcel } from "@/types";

// Define the form schema for pickup


export default function MarkTransit() {
  const { data, isLoading, error } = useGetAllParcelsQuery({
    currentStatus: currentStatus.PICKED
  });
  const [transitParcel] = useMarkInTransitMutation();
  const [selectedParcel, setSelectedParcel] = useState<IParcel | null>(null);
  // Initialize form with useForm
 
  // Open modal with parcel data and reset form
  const handleTransitClick = (parcel: IParcel) => {
    setSelectedParcel(parcel);
  };

  // Handle confirm pick
  const onSubmit = async (values: z.infer<typeof pickParcelSchema>) => {
    if (!selectedParcel) return;
    try {
      await transitParcel(
        // trackingNumber: selectedParcel.trackingId || selectedParcel._id as string,
       selectedParcel.trackingId
      ).unwrap();

      toast.success("Parcel picked successfully!");
      
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to pick parcel");
    }
  };

  useEffect(() => {
    if (isLoading) toast.loading("Loading parcels...");
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error("Error loading parcel data");
  }, [error]);

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
                <Button onClick={() => handleTransitClick(parcel)}>Pick</Button>
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