import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils";
import type { IStatusLog } from '@/types';
import { useLazyGetParcelStatusQuery } from '@/redux/features/parcel/parcel.api';

const trackSchema = z.object({
  trackingId: z.string().min(6, "Tracking ID must be at least 6 characters"),
});

export default function TrackParcel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [statusLogs, setStatusLogs] = useState<IStatusLog[]>([]);
  const [parcelStatus, { isLoading }] = useLazyGetParcelStatusQuery();


  const form = useForm<z.infer<typeof trackSchema>>({
    resolver: zodResolver(trackSchema),
    defaultValues: { trackingId: "" },
  });

  async function onSubmit(values: z.infer<typeof trackSchema>) {
    try {
      const res = await parcelStatus({ trackingId: values.trackingId }).unwrap();
      console.log("status data", res.data)
      // setStatusLogs(res.data.statusLogs??[]);
      setStatusLogs(res.data)
      toast.success("Parcel status retrieved successfully");
      console.log(statusLogs)
    } catch (error: any) {
      setStatusLogs([]);
      toast.error(error.data?.message || "Failed to retrieve parcel status");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter your tracking number</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex items-center gap-4 mx-auto">
          <FormField
            control={form.control}
            name="trackingId" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracking ID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your tracking ID"
                    className='w-xl'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-2xs mt-2" disabled={isLoading}>
            {isLoading ? "Loading..." : "Track Parcel"}
          </Button>
        </form>
      </Form>

      {/* -------------- */}
      {
        statusLogs.length > 0 && (
          <Card className="max-w-xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Parcel Delivery Status</h2>
            <CardContent>
              <div className="relative border-l-4 border-red-500">
                {statusLogs.map((log, i) => (
                  <div key={i} className="ml-4 mb-6">
                    <div className="flex items-center gap-2">
                      {i === statusLogs.length - 1 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <p className="font-medium">{log.status}</p>
                    </div>
                    {log.location && (
                      <p className="text-sm text-gray-500">{log.location}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(log.notes)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
