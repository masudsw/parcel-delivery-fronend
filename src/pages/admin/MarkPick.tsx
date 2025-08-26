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
import { useGetAllParcelsQuery, usePickParcelMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import type { IParcel } from "@/types";

// Define the form schema for pickup
const pickParcelSchema = z.object({
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z.string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^(?:\+88|01)\d{9}$/, "Please enter a valid Bangladesh phone number"),
  destinationAddress: z.object({
    address: z.string().min(5, "Please enter a valid address"),
    district: z.string().min(2, "Please enter a valid district"),
    country: z.string().min(2, "Please enter a valid country"),
  }),
  estimatedDeliveryDate: z.string().min(1, "Please select a delivery date"),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
  notes: z.string().optional(),
  shippingFee: z.number().min(0, "Shipping fee cannot be negative"),
  dimentions: z.object({
    length: z.number().min(0.1, "Length must be greater than 0"),
    width: z.number().min(0.1, "Width must be greater than 0"),
    height: z.number().min(0.1, "Height must be greater than 0"),
  }).optional(),
});

export default function MarkPick() {
  const { data, isLoading, error } = useGetAllParcelsQuery({
    currentStatus: currentStatus.REQUESTED
  });
  const [pickParcel] = usePickParcelMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<IParcel | null>(null);

  // Initialize form with useForm
  const form = useForm<z.infer<typeof pickParcelSchema>>({
    resolver: zodResolver(pickParcelSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      destinationAddress: {
        address: "",
        district: "",
        country: ""
      },
      estimatedDeliveryDate: "",
      weight: 0,
      notes: "",
      shippingFee: 0,
      dimentions: {
        length: 0,
        width: 0,
        height: 0
      }
    }
  });

  // Open modal with parcel data and reset form
  const handlePickClick = (parcel: IParcel) => {
    setSelectedParcel(parcel);

    // Reset form with parcel data (admin can update sender-provided info)
    form.reset({
      receiverName: parcel.receiverName,
      receiverPhone: parcel.receiverPhone,
      destinationAddress: parcel.destinationAddress,
      weight: parcel.weight,
      dimentions: parcel.dimentions,
      estimatedDeliveryDate: parcel.estimatedDeliveryDate ? new Date(parcel.estimatedDeliveryDate).toISOString().slice(0, 16) : "",
      notes: "",
      shippingFee: parcel.shippingFee || 0
    });

    setIsDialogOpen(true);
  };

  // Handle confirm pick
  const onSubmit = async (values: z.infer<typeof pickParcelSchema>) => {
    if (!selectedParcel) return;
    const pickData = {
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        destinationAddress: {
          address: values.destinationAddress.address,
          district: values.destinationAddress.district,
          country: values.destinationAddress.country
        },
        dimentions: {
          height: values.dimentions?.height,
          width: values.dimentions?.width,
          length: values.dimentions?.length
        },

        estimatedDeliveryDate: new Date(values.estimatedDeliveryDate).toISOString(),
        weight: values.weight,
        notes: values?.notes,
        shippingFee: values.shippingFee,

      };
       const mutationPayload={
          trackingId:selectedParcel.trackingId,
          ...pickData
        }

    try {
      
      await pickParcel(
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
              <td className="border border-gray-300 p-2">{parcel.receiverPhone}</td>
              <td className="border border-gray-300 p-2">{parcel.weight} kg</td>
              <td className="border border-gray-300 p-2">
                {parcel.destinationAddress.address}, {parcel.destinationAddress.district}
              </td>
              <td className="border border-gray-300 p-2">
                <Button onClick={() => handlePickClick(parcel)}>Pick</Button>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receiverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Receiver full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiverPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="01XXXXXXXXX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="destinationAddress.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full street address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="destinationAddress.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="District name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Country name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dimentions.length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Length"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimentions.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Width"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimentions.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Height"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Weight in kg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Fee ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Shipping fee"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimatedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Delivery Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                        placeholder="Additional notes or instructions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Confirm Pick
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}