import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { IParcelBase } from "@/types/parcel.types";
import { parcelSchema } from "@/ZodShema/parcelShema";
import type z from "zod";
import { useGetMyParcelsQuery, useUpdateParcelsMutation } from "@/redux/features/parcel/parcel.api";

// Define the form schema for pickup - matches your Postman body
type FormData = z.infer<typeof parcelSchema>;

export default function MyParcels() {
  const { data, isLoading, error } = useGetMyParcelsQuery();
  const [updateParcel] = useUpdateParcelsMutation(); // 2. Call the mutation hook
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<IParcelBase | null>(null);
  const toastIdRef = useRef<string | number | null>(null);
  useEffect(() => {
    if (isLoading) {
 
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      toastIdRef.current = toast.loading("Loading parcels...");
    } else {
      
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
     
      if (data && !error) {
        
      } else if (error) {
        toast.error("Error loading parcel data");
      }
    }
  }, [isLoading, data, error]); 


  const form = useForm<FormData>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      originAddress: {
        address: "",
        district: "",
        country: "",
      },
      destinationAddress: {
        address: "",
        district: "",
        country: "",
      },
      dimentions: {
        height: 0,
        width: 0,
        length: 0,
      },
      description: "",
      weight: 0,
    },
  });

  // Open modal with parcel data and reset form
  const handleUpdateClick = (parcel: IParcelBase) => {
    setSelectedParcel(parcel);

    // Reset form with parcel data
    form.reset({
      receiverName: parcel.receiverName,
      receiverPhone: parcel.receiverPhone,
      originAddress: parcel.originAddress,
      destinationAddress: parcel.destinationAddress,
       dimentions: {
        height: parcel.dimentions?.height,
        width: parcel.dimentions?.width,
        length:parcel.dimentions?.length,
      },
      description: parcel.description,
      weight: parcel.weight || 0,
    });
    setIsDialogOpen(true);
  };

  // Handle confirm update
  const onSubmit = async (values: FormData) => {
    if (!selectedParcel?._id) {
      toast.error("No parcel ID found for this update");
      return;
    }

    try {
      // 3. Prepare the correct payload with ID and updated data
      const payload = {
        id: selectedParcel._id,
        payload: {
          receiverName: values.receiverName,
          receiverPhone: values.receiverPhone,
          originAddress: values.originAddress,
          destinationAddress: values.destinationAddress,
          dimensions:{
            
          } ,
          description: values.description,
          weight: values.weight,
        },
      };

      // 4. Call the mutation hook
      await updateParcel(payload).unwrap();

      toast.success("Parcel updated successfully!");
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error.data?.message || "Failed to update parcel");
    }
  };

  useEffect(() => {
    if (error) toast.error("Error loading parcel data");
  }, [error]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Requested Parcels</h1>
      {/* ... (table and empty state rendering is unchanged) ... */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
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
              <td className="border border-gray-300 p-2">{parcel.receiverName}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverPhone}</td>
              <td className="border border-gray-300 p-2">{parcel.weight} kg</td>
              <td className="border border-gray-300 p-2">
                {parcel.destinationAddress.address}, {parcel.destinationAddress.district}
              </td>
              <td className="border border-gray-300 p-2">
                <Button onClick={() => handleUpdateClick(parcel)}>Update</Button>
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
      {/* Update Parcel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Parcel Details</DialogTitle>
            <DialogDescription>
              Modify the parcel details and confirm the update.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="originAddress.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin Address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full street address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <FormLabel>Destination District *</FormLabel>
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
                      <FormLabel>Destination Country *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Country name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                          placeholder="Height in cm"
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
                          placeholder="Width in cm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          placeholder="Length in cm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Package description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <Button type="submit" className="w-full">
                Confirm Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}