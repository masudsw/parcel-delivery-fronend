import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useEffect, useState } from "react"
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api"
import { toast } from "sonner"


const formSchema = z.object({
    pin: z.string().min(6, { message: "Otp password must be 6 charecters" }),
})

export function Verify() {
    const location = useLocation()
    const navagate = useNavigate();
    const [sendOtp, { error: sendOtpError }] = useSendOtpMutation()
    const [verifyOtp, { error: verifyOtpError }] = useVerifyOtpMutation();


    const [timer, setTimer] = useState(5);
    const [email, setEmail] = useState(location.state)

    const [confirmed, setConfirmed] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pin: "",
        },
    })
    // Function to extract error message from RTK-Query error
    const getErrorMessage = (error: any) => {
        if (!error) return null;
        
        // Axios error structure
        if (error.data) {
            return error.data.message || error.data.error || 'An error occurred';
        }
        
        // Other error formats
        if (error.message) {
            return error.message;
        }
        
        return 'An error occurred';
    };
    async function handleSendOtp() {
        console.log(email)
        if (!email) {
            toast.error("user not found")
            return
        }
        const toastId = toast.loading("sending OTP");
        try {
            const res = await sendOtp({ email: email }).unwrap();
            if (res.success) {
                toast.success("OTP send", { id: toastId })
                setConfirmed(true);
                setTimer(5);
            }

        } catch (error) {
            console.log(error)
            const errorMessage = getErrorMessage(error);
             toast.error(errorMessage || "Failed to send OTP", { id: toastId });
        }
    }


    async function onSubmit(values: z.infer<typeof formSchema>) {
        const toastId = toast.loading("Verifying OTP");
        const userInfo = {
            email,
            otp: values.pin
        }
        try {
            const res = await verifyOtp(userInfo).unwrap()
            if (res.success) {
                toast.success("OTP verified", { id: toastId })
                setConfirmed(true)
                setEmail(null)
                navagate("/login")

            }

        } catch (error) {
            console.error(error)
            const errorMessage = getErrorMessage(error);
            
            // Show error in toast
            toast.error(errorMessage || "Invalid OTP. Please try again.", { id: toastId });
            form.setError('root.server', {
                type: 'manual',
                message: errorMessage || "Verification failed"
            });
        }

    }
    useEffect(() => {
        if (!email) {
            navagate("/");
        }
        if (confirmed) {
            return;
        }
        const timerId = setInterval(
            () => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0))
            }, 1000
        )
        return () => clearInterval(timerId)
    }, [email, confirmed])
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            {
                confirmed ? (
                    <Card className="w-[200px]">
                        <CardHeader>
                            <CardTitle>Check you email to get the OPT</CardTitle>
                            <CardDescription>
                                Please enter the 6-digit code we send to {email}
                            </CardDescription>

                        </CardHeader>
                        <CardContent>
                            <Form {...form}>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="pin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>

                                                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} />
                                                            <InputOTPSlot index={1} />
                                                            <InputOTPSlot index={2} />
                                                        </InputOTPGroup>
                                                        <InputOTPSeparator />
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={3} />
                                                            <InputOTPSlot index={4} />
                                                            <InputOTPSlot index={5} />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormDescription className="sr-only">
                                                    This is your public display name.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Verify OTP</Button>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                        </CardFooter>
                    </Card>

                ) : (
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Verifying your email address</CardTitle>
                            <CardDescription>
                                We will send you an OTP at {email}
                            </CardDescription>

                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button onClick={handleSendOtp}>Cofirm</Button>
                        </CardFooter>
                    </Card>

                )

            }
        </div>

    )
}
