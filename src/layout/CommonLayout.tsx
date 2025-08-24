
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { type ReactNode } from "react";
interface IProps {
    children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <div className="grow-1">{children}</div>
            <Footer/>

        </div>
    );
}