'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header";
import Link from "next/link";

interface BlogDetailParams {
    slug: string[];
}

const BlogDetail = ({ params }: { params: BlogDetailParams }) => {
    const [blog, setBlog] = useState<any>(null);
    const [scrollY, setScrollY] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [blogId, setBlogId] = useState<any>('');
    const [paragraphs, setParagraphs] = useState<any>([]);

    useEffect(() => {
        if (params) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/paragraphs/getBlogDetail`, {
                name: params,
            })
                .then(res => {
                    console.log(res.data);
                    setBlog(res.data);
                    setBlogId(res.data.blog.blogid);
                    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/paragraphs/getAllParagraphsById`,{
                        id: res.data.blog.blogid
                    }).then(res =>{
                        console.log(res.data);
                        setParagraphs(res.data);
                    }).catch(err =>{
                        console.log('Error fetch data: ' + err);
                    })
                })
                .catch(err => {
                    console.log('Error fetch data: ' + err);
                });
        }
    }, [params]);

    useEffect(() => {
        setIsClient(true);
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const opacity = isClient ? Math.min(scrollY / window.innerHeight, 1) : 0;

    return (
        <div>
            {blog ? (
                <div>
                    <div>
                        <div className="w-full h-screen relative">
                            <img className="w-full h-full object-cover" src={`${blog.blog.blogimg}`} />
                            <div className="absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-gray-900 to-white/0 transition-opacity duration-300 overlay"
                                style={{
                                    background: `linear-gradient(to bottom, rgba(31, 41, 55, ${0.5 - opacity * 1}), white)`,
                                }} />
                            <div className="absolute top-0 w-full h-full flex flex-col justify-center text-center text-white py-4">
                                <h1 className="font-bold text-5xl py-2">{blog.blog.locations}</h1>
                                <h3 className="py-7 text-3xl">{blog.blog.title}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="w-[90%] mx-[5%]">
                        <div id="b_nav">
                            <p>
                                <Link className="text-[#4B70F5]" href='/'>Home </Link>
                                <span>/ </span>
                                <Link className="text-[#4B70F5]" href='/blog'>Blog </Link> <span>/ {blog.blog.title}</span>

                            </p>
                        </div>
                        <div className="pt-20" id="b_blog">
                            <div id="b_header">
                                <p className="text-[18px] italic font-medium text-center">{blog.blog.descript}</p>
                            </div>
                            <div className="mt-10" id="blog_content">
                                {paragraphs.map((item: any) =>(
                                    <div>
                                        <div className="flex justify-center items-center">
                                        <img className="w-[80%] h-[800px]" src={item.blogImage.imagepath}/>
                                    </div>
                                    <p className="text-[18px] text-center my-8">{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-screen flex justify-center items-center">
                    <p className="text-white">Loading...</p>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
