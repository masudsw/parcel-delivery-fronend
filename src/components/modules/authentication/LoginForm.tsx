import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation } from "@/redux/features/auth/auth.api"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Password from "./Password"
import config from "@/config"


const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
     .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character"),
    
    // .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
  userType: z.enum(["SENDER", "RECEIVER","ADMIN"]).refine((val) => val === "SENDER" || val === "RECEIVER"|| val==="ADMIN", {
    message: "Please select a user type",
  })
})
export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [login] = useLoginMutation()
 
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {

      email: "",
      password: "",
      userType: "SENDER"
    },
  })
  const navigate=useNavigate()

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const userInfo = {
      email: data.email,
      password: data.password,
      userType: data.userType,
    };
    try {
      const res=await login(userInfo).unwrap();
      console.log(res);
      toast.success("Login successfully")
       navigate("/dashboard")
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      toast.error(error.data.message || "Login failed");
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
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
                      {/* <Input type="password" placeholder="********" {...field} /> */}
                      <Password {...field}/>
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
                        <SelectItem value="ADMIN">Admin</SelectItem>
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
                Sign In
              </Button>
            </div>
          </form>
        </Form>


        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" 
        onClick={()=>window.open(`${config.baseUrl}/auth/google`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  )
}
