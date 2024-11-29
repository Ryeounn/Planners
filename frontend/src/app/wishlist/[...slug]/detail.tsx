'use client';
import { faHeart, faLocationDot, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WishListDetailParams {
    slug: string[];
}

const WishListDetail = ({ params }: { params: WishListDetailParams }) => {
    const [scrollY, setScrollY] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [wishlistName, setWishlistName] = useState<string>('');
    const [tour, setTour] = useState<any>([]);
    const [wishlistId, setWishlistId] = useState<any>('');
    const router = useRouter();
    useEffect(() => {
        if (params.slug && params.slug.length > 0) {
            const slug = params.slug[0];
            const splitSlug = slug.split('-');
            const extractedWishlist = splitSlug.slice(0, -1).join('-');
            const extractedWishlistId = splitSlug[splitSlug.length - 1];
            setWishlistName(extractedWishlist);
            setWishlistId(extractedWishlistId);

            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/findAllWishlistByGroupId`, {
                groupwishlistid: extractedWishlistId
            }).then(res => {
                setTour(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        }
    }, [params.slug]);

    const handleDeleteWishlist = async (wishlistid: number) => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/deleteWishlist`, {
            wishlistid: wishlistid
        }).then(res => {
            const currentDate = new Date();
            const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
            if (res.data.success) {
                const successMessage = 'Delete Tour successfully';
                toast.success(successMessage, {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                router.refresh();
            } else {
                const failMessage = 'Delete Tour fail';
                toast.error(failMessage, {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
            }
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }

    const handleAddWishlist = () =>{
        router.push('/destination');
    }

    const opacity = isClient ? Math.min(scrollY / window.innerHeight, 1) : 0;
    return (
        <div>
            <div className="w-full h-screen relative">
                <img className="w-full h-full object-cover" src="/assets/images/app/wishlist.jpg" />
                <div className="absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-gray-900 to-white/0 transition-opacity duration-300 overlay"
                    style={{
                        background: `linear-gradient(to bottom, rgba(31, 41, 55, ${0.5 - opacity * 1}), white)`,
                    }} />
                <div className="absolute top-0 w-full h-full flex flex-col justify-center text-center text-white py-4">
                    <h1 className="font-bold text-5xl py-2">{wishlistName}</h1>
                    <h3 className="py-7 text-3xl">Details of favorite tours in {wishlistName}</h3>
                </div>
            </div>
            <div className="w-[90%] mx-[5%]">
                <div id="wd_nav">
                    <p>
                        <Link className="text-[#4B70F5]" href='/'>Home </Link>
                        <span>/ </span>
                        <Link className="text-[#4B70F5]" href='/wishlist'>Wishlist </Link> <span>/ {wishlistName}</span>
                    </p>
                </div>
                <div id="wd_content">
                    <div className="grid grid-cols-4 gap-10 mt-10">
                        {tour && tour.length > 0 ? (
                            tour.map((item: any) => (
                                <div key={item.tourid} className="group cursor-pointer">
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteWishlist(item.wishlistid);
                                            }}
                                            className="absolute top-2 right-3 py-3 px-3 bg-white rounded-[50%] z-[999999] text-[rgb(230,0,18)] cursor-pointer"
                                            icon={faHeart}
                                        />

                                        <Link href={`/travel/${item.tour.tourname.replace(/\s+/g, '-')}-${item.tour.tourid}`}>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <div className="relative">
                                                    <img
                                                        className="w-full h-[250px] rounded-lg transition-all duration-500 relative group-hover:z-10 group-hover:-translate-y-5"
                                                        src={item.tour.tourpath}
                                                    />
                                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:z-20 group-hover:-translate-y-5 transition-all duration-500 rounded-lg">
                                                        <div className="text-white text-[24px] font-bold uppercase">
                                                            {item.tour.nation}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative -top-16 w-[95%] ml-[2.5%] mr-[2.5%] h-[200px] bg-white shadow-lg py-3 rounded-lg !z-0">
                                                    <div className="text-[18px] uppercase text-center font-bold bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent border-x-4 border-solid border-[#0B8494]">
                                                        {item.tour.tourname}
                                                    </div>
                                                    <div className="py-2 px-4 text-left">
                                                        {item.tour.descrip}
                                                    </div>
                                                    <div className="mt-10">
                                                        <div className="w-full absolute bottom-5 flex justify-center items-center">
                                                            <div className="w-[50%] border-r-[.5px] border-solid border-[#ccc] text-center">
                                                                <FontAwesomeIcon className="mr-2 text-[#0B8494]" icon={faLocationDot} />
                                                                {item.tour.nation}
                                                            </div>
                                                            <div className="w-[50%] border-l-[.5px] border-solid border-[#ccc] text-center">
                                                                <FontAwesomeIcon className="mr-2 text-[#0B8494]" icon={faTag} />
                                                                {item.tour.totaldate} days
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col justify-center items-center col-span-4 h-[200px] space-y-2">
                                <FontAwesomeIcon className="text-[40px] text-[#ccc]" icon={faHeart} />
                                <p className="!mt-5 text-[20px] font-semibold block text-center">Nothing here yet</p>
                                <p className="text-center">Select the heart icon to save experiences.</p>
                                <div onClick={handleAddWishlist} className="!mt-5 rounded-md py-3 px-6 text-white bg-[#0B8494] hover:bg-[#0b8494cf] cursor-pointer">
                                    Explore experiences
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishListDetail;