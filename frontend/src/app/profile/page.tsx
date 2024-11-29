import React from "react";
import Header from "./header";
import Link from "next/link";
import { Metadata } from "next";
import Profiler from "./profile";

export const metadata: Metadata = {
    title: 'Your profile',
    description: 'About your personal information',
}

const Profile = () =>{
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
                        Profile
                    </p>
                </div>
                <div id="t_tour" className="mt-10">
                    <h2 className="text-xl font-montserrat font-medium leading-[50px] text-center">Your<br />
                        <p className="text-5xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">Profile</p>
                    </h2>
                    <div className="mt-10">
                        <Profiler/>
                    </div>
                </div>
            </div>
    </div>
)
}

export default Profile;