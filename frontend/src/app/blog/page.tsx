import React from "react";
import Header from "./header";
import { Metadata } from "next";
import Link from "next/link";
import Category from "./category";

export const metadata: Metadata = {
    title: 'Blog travel',
    description: 'A travel blog is an online platform where authors share travel experiences, tips, and destination guides. It inspires readers and provides useful information for planning memorable trips.',
}

const Blog = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="w-[90%] mx-[5%]">
                <div id="b_nav">
                    <p>
                        <Link className="text-[#4B70F5]" href='/'>Home </Link>
                        <span>/ </span>
                        Blog
                    </p>
                </div>
                <Category/>
            </div>
        </div>
    )
}

export default Blog;