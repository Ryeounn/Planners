import React from "react";
import Header from "./header";
import Link from "next/link";
import { Search } from "./travel";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Travel',
    description: 'Travel opens the door to new adventures, cultures, and perspectives, enriching both the mind and soul with unforgettable experiences.',
}

const Travel = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="w-[90%] mx-[5%]">
                <div id="t_sidemap">
                    <p>
                        <Link className="text-[#4B70F5]" href='/'>Home </Link>
                        <span>/ </span>
                        Travel
                    </p>
                </div>
                <div id="t_tour" className="mt-10">
                    <h2 className="text-xl font-montserrat font-medium leading-[50px] text-center">Find Your<br />
                        <p className="text-5xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">Next Stay</p>
                    </h2>
                    <div className="mt-10">
                        <Search />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Travel;

