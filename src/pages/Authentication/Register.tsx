

import registerImage from "../../assets/images/parcel-delivery.png"
import { RegisterForm } from "@/components/modules/authentication/RegisterForm"



export default function Register() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="bg-muted relative hidden lg:block">
        <img
          src={registerImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-1 md:p-4">
        
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-md ">
            <RegisterForm />
          </div>
        </div>
      </div>
      
    </div>
  )
}
