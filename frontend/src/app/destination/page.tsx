import React from "react";
import Header from "./header";
import { Metadata } from "next";
import Link from "next/link";
import { Title, MostDestination } from "./destination";

export const metadata: Metadata = {
    title: 'Destination',
    description: 'A travel destination offers a unique experience, allowing visitors to explore new cultures, natural landscapes, and local attractions. Whether it a bustling city or a serene beach, every place has its own charm and beauty waiting to be discovered.',
}

const Destination = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="w-[90%] mx-[5%]">
                <div id="b_destination">
                    <p>
                        <Link className="text-[#4B70F5]" href='/'>Home </Link>
                        <span>/ </span>
                        Destination
                    </p>
                    <div className="">
                        <div className="text-center">
                            <h2 className="text-xl font-montserrat font-medium leading-[50px]">All Attractive <br />
                                <span className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">
                                    Places
                                </span>
                            </h2>
                        </div>
                        <Title />
                    </div>
                    <div className="mt-20">
                        <div className="text-center">
                            <h2 className="text-xl font-montserrat font-medium leading-[50px]">Most Attractive <br />
                                <span className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">
                                    Places
                                </span>
                            </h2>
                        </div>
                        <MostDestination />
                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default Destination;