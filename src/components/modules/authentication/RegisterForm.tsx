import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRegisterMutation } from "@/redux/features/auth/auth.api"
import { toast } from "sonner"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    // .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
     .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character"),
  phone: z.string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^(?:\+88|01)\d{9}$/, "Please enter a valid Bangladesh phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  userType: z.enum(["SENDER", "RECEIVER"]).refine((val) => val === "SENDER" || val === "RECEIVER", {
    message: "Please select a user type",
  }),
})

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [register] = useRegisterMutation();
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      userType: "SENDER"
    },
  })

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      userType: data.userType,
      address: data.address
    };
    try {
      await register(userInfo).unwrap();
      navigate("/verify", { state: data.email })
      /* eslint-disable @typescript-eslint/no-explicit-any */

    } catch (error: any) {
      console.log("error", error.data)
      console.log(error.message); // "User already exists"
      console.log(error.success); // false

      if (error.data.message === "User already exist") {
        toast.error("This email is already registered. Please login instead.");
      } else {
        toast.error(error.message || "Registration failed");
      }
    }

  }


  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {/* Must be at least 8 characters with uppercase, lowercase, and number */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SENDER">Sender</SelectItem>
                      <SelectItem value="RECEIVER">Receiver</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="sr-only">
                    Are you sending packages or receiving them?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2">
              Create Account
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  )
}