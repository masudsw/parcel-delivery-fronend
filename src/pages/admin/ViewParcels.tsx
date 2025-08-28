import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect, useRef } from "react";




export default function ViewParcels() {
  // Remove async/await from hooks - they're synchronous
  const { data, isLoading, error } = useGetAllParcelsQuery({});
  const toastIdRef = useRef<string | number | null>(null);
  

  useEffect(() => {
    if (isLoading) toastIdRef.current = toast.loading("Loading parcels...");
    else if (toastIdRef.current)
    {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

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
            <th className="border border-gray-300 p-2 text-left">status</th>
            <th className="border border-gray-300 p-2 text-left">Destination</th>
           
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((parcel) => (
            <tr key={parcel._id}>
              <td className="border border-gray-300 p-2">{parcel.trackingId}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverName}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverPhone}</td>
              <td className="border border-gray-300 p-2">{parcel.currentStatus}</td>
              <td className="border border-gray-300 p-2">
                {parcel.destinationAddress.address}, {parcel.destinationAddress.district}
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