import Link from "next/link";
import React from "react";
import Header from "./header";
import Nav from "./nav";
import { Metadata } from "next";
import { Check } from "./checkout";

export const metadata: Metadata = {
    title: 'Check Out',
    description: 'Final step buy tour'
}

const CheckOut = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="w-[90%] mx-[5%]">
                <div id="c_sidemap">
                    <Nav/>
                </div>
                <div id="c_content" className="mt-5">
                    <Check/>
                </div>
            </div>
        </div>
    )
}

export default CheckOut;