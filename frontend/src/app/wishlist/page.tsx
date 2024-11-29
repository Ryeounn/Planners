import React from "react";
import Header from "./header";
import Link from "next/link";
import { Metadata } from "next";
import List from "./wishlist";

export const metadata: Metadata = {
    title: 'Your wishlist',
    description: 'Your favorites list',
}

const Wishlist = () =>{
return(
    <div>
        <div>
                <Header />
            </div>
            <div className="w-[90%] mx-[5%]">
                <div id="t_sidemap">
                    <p>
                        <Link className="text-[#4B70F5]" href='/'>Home </Link>
                        <span>/ </span>
                        Wishlist
                    </p>
                </div>
                <div id="t_tour" className="mt-10">
                    <h2 className="text-xl font-montserrat font-medium leading-[50px] text-center">Your<br />
                        <p className="text-5xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">Favorites list</p>
                    </h2>
                    <div className="mt-10">
                        <List/>
                    </div>
                </div>
            </div>
    </div>
)
}

export default Wishlist;