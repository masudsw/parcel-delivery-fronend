import z from "zod";

export const parcelSchema = z.object({
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
  description: z.string().min(10, "Description must be at least 10 characters"),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
});