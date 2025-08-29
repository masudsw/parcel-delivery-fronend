import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetParcelToReceiveQuery, useReceiveParcelMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import type { IParcelBase } from "@/types";

// Define the form schema for pickup
const receiveParcelSchema = z.object({
  receiverPhone: z.string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^(?:\+88|01)\d{9}$/, "Please enter a valid Bangladesh phone number"),
});

export default function ReceiveParcel() {
  const { data, isLoading, error } = useGetParcelToReceiveQuery(null);
  const [receiveParcel, { isLoading: isReceiving }] = useReceiveParcelMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<IParcelBase | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  // Initialize form with useForm
  const form = useForm<z.infer<typeof receiveParcelSchema>>({
    resolver: zodResolver(receiveParcelSchema),
    defaultValues: {
      receiverPhone: "",
    }
  });

  // Handle loading state with toast
  useEffect(() => {
    if (isLoading) {
      toastIdRef.current = toast.loading("Loading parcels...");
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isLoading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      // Dismiss loading toast if it exists
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      toast.error("Error loading parcel data");
    }
  }, [error]);

  // Open modal with parcel data and reset form
  const handleReceiveParcelClick = (parcel: IParcelBase) => {
    setSelectedParcel(parcel);
    form.reset({
      receiverPhone: "",
    });
    setIsDialogOpen(true);
  };

  // Handle confirm receive
  const onSubmit = async (values: z.infer<typeof receiveParcelSchema>) => {
    if (!selectedParcel) return;

    try {
      await receiveParcel({
        trackingId: selectedParcel.trackingId as string,
        receiverPhone: values.receiverPhone
      }).unwrap();

      toast.success("Parcel received successfully!");
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to receive parcel");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Requested Parcels</h1>
      
      {isLoading && (
        <div className="text-center py-8">
          Loading parcels...
        </div>
      )}
      
      {!isLoading && data && (
        <>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Tracking ID</th>
                <th className="border border-gray-300 p-2 text-left">Receiver</th>
                <th className="border border-gray-300 p-2 text-left">Phone</th>
                <th className="border border-gray-300 p-2 text-left">Weight</th>
                <th className="border border-gray-300 p-2 text-left">Current Status</th>
                <th className="border border-gray-300 p-2 text-left">Destination</th>
                <th className="border border-gray-300 p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((parcel) => (
                <tr key={parcel._id}>
                  <td className="border border-gray-300 p-2">{parcel.trackingId}</td>
                  <td className="border border-gray-300 p-2">{parcel.receiverName}</td>
                  <td className="border border-gray-300 p-2">***********</td>
                  <td className="border border-gray-300 p-2">{parcel.weight} kg</td>
                  <td className="border border-gray-300 p-2">{parcel.currentStatus}</td>
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

          {data.data?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No requested parcels found.
            </div>
          )}
        </>
      )}

      {/* Receive Parcel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Parcel Receive</DialogTitle>
            <DialogDescription>
              Enter the receiver's phone number to confirm the parcel has been received.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="receiverPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter receiver's phone number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isReceiving}>
                {isReceiving ? "Receiving..." : "Confirm Receive"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}