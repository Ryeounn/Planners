'use client';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { url } from "inspector";
import { format } from 'date-fns';
import Link from "next/link";

const Category = () => {
    const [location, setLocation] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 5;
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = location.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(location.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        return format(date, 'MMM dd, yyyy');
    };

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/getLocation`)
            .then(res => {
                console.log(res.data);
                setLocation(res.data);
            }).catch(err => {
                console.log('Error fetch data');
            })
    }, []);

    return (
        <div id="b_destination">
            <p className="text-3xl font-montserrat pt-10">Explore by destination</p>
            <div className="mt-5 flex">
                <div className="border border-solid w-fit py-2 px-4 rounded-md border-[#ccc] cursor-pointer hover:border-[#3c3c3c]">
                    <FontAwesomeIcon className="mr-[6px]" icon={faGlobe} />
                    All articles
                </div>
                {location.map((item: any) => (
                    <div key={item.blogid} className="border border-solid w-fit py-2 px-4 rounded-md border-[#ccc] cursor-pointer hover:border-[#3c3c3c] ml-[10px]">
                        {item.locations}
                    </div>
                ))}
            </div>
            <div className="mt-14">
                <div className="font-semibold font-montserrat text-[20px]">All Articles</div>
                <div className="mt-10">
                    {currentProducts.map((item: any) => (
                        <div key={item.blogid} className="h-[255px] relative border border-[#ccc] border-solid rounded-md mb-4 cursor-pointer">
                            <Link href={`/blog/${item.title.replace(/\s+/g, '-')}`}>
                                <div className="flex">
                                    <div className="w-[80%] h-full">
                                        <div className="px-5 py-5">
                                            <p className="text-[24px] font-semibold mb-3">{item.title}</p>
                                            <p>
                                                {item.descript}
                                            </p>
                                            <p className="absolute bottom-8">
                                                <FontAwesomeIcon className="text-[10px] text-[#ccc] mr-2" icon={faCircle} />
                                                created {formatDate(item.created)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-[20%] h-full ">
                                        <div className="w-full h-[254px] bg-left bg-cover rounded-e-md"
                                            style={{ backgroundImage: `url(${item.blogimg})` }}
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                    <div className="flex justify-center mt-6 m-[20px_0] p-[10px_0]">
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`mx-1 ${number === currentPage ? 'bg-[#000000] text-[#fff] rounded-[50%] font-bold w-[40px] h-[40px] p-[5px]' : 'bg-[#eee] text-[#374151] rounded-[50%] w-[40px] h-[40px] p-[5px] '} hover:bg-[#89bde7] hover:text-[#000]`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                </div>
            </div>
        </div>
    )
}

export default Category;