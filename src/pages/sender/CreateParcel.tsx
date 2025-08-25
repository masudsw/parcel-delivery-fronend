import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Define the form schema
const parcelSchema = z.object({
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z.string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^(?:\+88|01)\d{9}$/, "Please enter a valid Bangladesh phone number"),
  originAddress: z.object({
    address: z.string().min(5, "Please enter a valid address"),
    district: z.string().min(2, "Please enter a valid district"),
    country: z.string().min(2, "Please enter a valid country"),
  }),
  destinationAddress: z.object({
    address: z.string().min(5, "Please enter a valid address"),
    district: z.string().min(2, "Please enter a valid district"),
    country: z.string().min(2, "Please enter a valid country"),
  }),
  dimentions: z.object({
    height: z.number().min(0.1, "Height must be greater than 0"),
    width: z.number().min(0.1, "Width must be greater than 0"),
    length: z.number().min(0.1, "Length must be greater than 0"),
  }),
  description: z.string().min(5, "Description must be at least 5 characters"),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
});

export function CreateParcel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof parcelSchema>>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      originAddress: {
        address: "",
        district: "",
        country: "Bangladesh",
      },
      destinationAddress: {
        address: "",
        district: "",
        country: "Bangladesh",
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

  async function onSubmit(data: z.infer<typeof parcelSchema>) {
    try {
      // Here you would call your API mutation
      console.log("Parcel data:", data);
      toast.success("Parcel created successfully!");
      form.reset();
    } catch (error: any) {
      console.error("Error creating parcel:", error);
      toast.error(error.message || "Failed to create parcel");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 max-w-2xl mx-auto p-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create New Parcel</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new parcel shipment
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Receiver Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Receiver Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="receiverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receiver Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter receiver's full name" {...field} />
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
                    <FormLabel>Receiver Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter receiver's phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Origin Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Origin Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="originAddress.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originAddress.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Destination Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Destination Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="destinationAddress.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="destinationAddress.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter district" {...field} />
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
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Parcel Dimensions (cm)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dimentions.height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Height" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Width" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Length" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Weight and Description */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="Weight in kg" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the contents of the parcel" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Parcel
          </Button>
        </form>
      </Form>
    </div>
  );
}