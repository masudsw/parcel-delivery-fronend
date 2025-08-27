import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currentStatus } from "@/constants/parcelStatus";
import { useGetAllParcelsQuery, useMarkInTransitMutation, usePickParcelMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import type { IParcel } from "@/types";

// Define the form schema for pickup
const receiveParcelSchema = z.object({
  receiverPhone: z.string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^(?:\+88|01)\d{9}$/, "Please enter a valid Bangladesh phone number"),
});

export default function ReceiveParcel() {
  const { data, isLoading, error } = useGetAllParcelsQuery({
    currentStatus: currentStatus.IN_TRANSIT
  });
  const [receiveParcel] = useMarkInTransitMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<IParcel | null>(null);

  // Initialize form with useForm
  const form = useForm<z.infer<typeof receiveParcelSchema>>({
    resolver: zodResolver(receiveParcelSchema),
    defaultValues: {
      receiverPhone: "",
    
    }
  });

  // Open modal with parcel data and reset form
  const handleReceiveParcelClick = (parcel: IParcel) => {
    setSelectedParcel(parcel);

    // Reset form with parcel data (admin can update sender-provided info)
    form.reset({
      receiverPhone: "",
    });

    setIsDialogOpen(true);
  };

  // Handle confirm pick
  const onSubmit = async (values: z.infer<typeof receiveParcelSchema>) => {
    if (!selectedParcel) return;
       const mutationPayload={
          trackingId:selectedParcel.trackingId,
          receiverPhone:values.receiverPhone
        }
    try {
      await receiveParcel(
        // trackingNumber: selectedParcel.trackingId || selectedParcel._id as string,
       mutationPayload
      ).unwrap();

      toast.success("Parcel picked successfully!");
      setIsDialogOpen(false);
      form.reset();
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
      <h1 className="text-2xl font-bold mb-6">Requested Parcels</h1>

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
              <td className="border border-gray-300 p-2">***********</td>
              <td className="border border-gray-300 p-2">{parcel.weight} kg</td>
              <td className="border border-gray-300 p-2">
                {parcel.destinationAddress.address}, {parcel.destinationAddress.district}
              </td>
              <td className="border border-gray-300 p-2">
                <Button onClick={() => handleReceiveParcelClick(parcel)}>Receive</Button>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Parcel Pickup</DialogTitle>
            <DialogDescription>
              Review and update parcel details before confirming pickup. You can modify sender-provided information.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Sender-provided information (editable by admin) */}
            
              <FormField
                control={form.control}
                name="receiverPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your phone number</FormLabel>
                    <FormControl>
                      <Input{...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Confirm Receive
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}