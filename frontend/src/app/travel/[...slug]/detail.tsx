'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faQrcode, faPlaneDeparture, faSackDollar, faChild, faBaby } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { BsHexagonFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface TourDetailParams {
    slug: string[];
}

const TravelDetail = ({ params }: { params: TourDetailParams }) => {
    const [tour, setTour] = useState<any>([]);
    const [scrollY, setScrollY] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [schedule, setSchedule] = useState<any>([]);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [tourname, setTourname] = useState<string>('');
    const [tourid, setTourid] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adult, setAdult] = useState<any>(1);
    const [children, setChildren] = useState<any>('');
    const [baby, setBaby] = useState<any>('');
    const [priceAdult, setPriceAdult] = useState<number>(0);
    const [priceChildren, setPriceChildren] = useState<number>(0);
    const [priceBaby, setPriceBaby] = useState<number>(0);
    const [totalAdult, setTotalAdult] = useState<number>(0);
    const [totalChildren, setTotalChildren] = useState<number>(0);
    const [totalBaby, setTotalBaby] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userid = sessionStorage.getItem('user');
            if (userid) {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/history/createHistory`, {
                    tourid: tourid,
                    userid: userid,
                    viewed: new Date()
                }).then(res => {
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                });
            } else {
                console.log('No Login');
            }
        }
    }, [tourid])


    useEffect(() => {
        if (params.slug && params.slug.length > 0) {
            const slug = params.slug[0];
            const splitSlug = slug.split('-');
            const extractedTourname = splitSlug.slice(0, -1).join('-');
            const extractedTourid = splitSlug[splitSlug.length - 1];

            if (extractedTourid !== tourid) {
                setTourname(extractedTourname);
                setTourid(extractedTourid);

                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/getTourById`, {
                    tour: extractedTourid
                }).then(res => {
                    setTour(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                });

                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tourprice/getTourPrice`, {
                    id: extractedTourid
                }).then(res => {
                    const prices = res.data.map((item: any) => parseFloat(item.price));
                    const minPrice = Math.min(...prices);
                    const pr = res.data.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
                    setPriceBaby(parseFloat(pr[0].price));
                    setPriceChildren(parseFloat(pr[1].price));
                    setPriceAdult(parseFloat(pr[2].price));
                    setMinPrice(minPrice);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                });

                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/getScheduleByTourId`, {
                    id: extractedTourid
                }).then(res => {
                    setSchedule(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                });
            }
        }
    }, [params.slug]);

    useEffect(() => {
        setTotalAdult(priceAdult * adult);
        setTotalChildren(priceChildren * children);
        setTotalBaby(priceBaby * baby);
    }, [priceAdult, adult, priceChildren, children, priceBaby, baby])

    useEffect(() => {
        setIsClient(true);
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const getTotalQuantity = () => {
        return Number(adult) + Number(children || 0) + Number(baby || 0);
    };

    const handleConfirm = () => {
        const total = getTotalQuantity();
        sessionStorage.setItem('tourid', tour.tourid);
        sessionStorage.setItem('tourname', tour.tourname);
        sessionStorage.setItem('totalQuantity', total.toString());
        sessionStorage.setItem('adult', adult.toString());
        sessionStorage.setItem('children', children.toString());
        sessionStorage.setItem('baby', baby.toString());
        sessionStorage.setItem('priceAdult', priceAdult.toString());
        sessionStorage.setItem('priceChildren', priceChildren.toString());
        sessionStorage.setItem('priceBaby', priceBaby.toString());
        router.push('/checkout');
    }

    const opacity = isClient ? Math.min(scrollY / window.innerHeight, 1) : 0;

    return (
        <div>
            {tour ? (
                <div>
                    <div className="w-full h-screen relative">
                        <img className="w-full h-[500px] object-cover" src={`${tour.tourpath}`} />
                        <div className="absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-gray-900 to-white/0 transition-opacity duration-300 overlay"
                            style={{
                                background: `linear-gradient(to bottom, rgba(31, 41, 55, ${0.5 - opacity * 1}), white)`,
                            }} />
                        <div className="absolute top-0 w-full h-full flex flex-col justify-center text-center text-white py-4">
                            <h1 className="font-bold text-5xl py-2">{tour.tourname}</h1>
                            <h3 className="py-7 text-3xl">{tour.nation}</h3>
                        </div>
                    </div>
                    <div className="w-[90%] mx-[5%]">
                        <div id="t_nav">
                            <p>
                                <Link className="text-[#4B70F5]" href='/'>Home </Link>
                                <span>/ </span>
                                <Link className="text-[#4B70F5]" href='/blog'>Travel </Link> <span>/ {tour.tourname}</span>
                            </p>
                        </div>
                        <div id="t_content" className="mt-10">
                            <div className="flex items-center justify-center h-full">
                                <div className="w-[29%] mr-[1%]">
                                    <img className="rounded-lg" src={tour.tourpath} />
                                    <div className="mt-2">
                                        <p className="text-center">
                                            <FontAwesomeIcon className="mr-2" icon={faQrcode} />
                                            <span className="font-semibold">
                                                {tour.tourcode}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="w-[70%]">
                                    <div className="pl-[4%] pr-[15%] mt-[-2.5%]">
                                        <p className="text-4xl font-semibold font-[Arial] bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">{tour.tourname}</p>
                                        <p className="text-[12px] px-4 rounded-lg italic text-white bg-[#0B8494] inline-block">{tour.totaldate} days {tour.totaldate - 1} night</p>
                                        <p className="mt-8"><FontAwesomeIcon className="mr-2" icon={faCalendarDays} />{formatDate(tour.startdate)}</p>
                                        <p className="mt-3">{tour.desclong}</p>

                                        <p className="mt-5">Only from <span className="text-[28px] font-semibold text-[rgb(230,0,18)]">{minPrice}$</span></p>
                                        <div
                                            className="mt-5 py-2 px-5 rounded-lg inline-block text-white bg-[#FF6500] cursor-pointer"
                                            onClick={handleOpenModal}>
                                            Buy now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="t_info" className="mt-24">
                            <div className="h-[calc(100%+100px)]">
                                <div className="text-center font-montserrat">
                                    <h2 className="text-xl font-montserrat font-medium leading-[50px]">Schedule Information<br />
                                        <span className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">
                                            {tour.tourname}
                                        </span>
                                    </h2>
                                </div>
                                <div className="mt-10 h-[calc(100%+100px)]">
                                    <div className="grid grid-cols-4 gap-1">
                                        {schedule.map((item: any) => (
                                            <div key={item.scheduleid} className="h-[500px] rounded-lg border-[2px] border-solid border-[#0B8494] mb-5">
                                                <div className="text-center py-2 rounded-t-md text-white bg-[#0B8494] font-semibold">
                                                    Day {item.daynumber}
                                                </div>
                                                <div className="w-[95%] mx-[2.5%] mt-3">
                                                    <div>
                                                        <div className="text-center rounded-lg mb-4">
                                                            <img className="w-[90%] h-[150px] inline-block !rounded-lg" src={item.morimg} />
                                                        </div>
                                                        <div className="mb-4">
                                                            <p className="text-[18px] font-semibold text-[#FF6500]"><span className="text-[#0B8494] mr-2"><FontAwesomeIcon icon={faLocationDot} /></span>{item.morplan}</p>
                                                            <p className="mt-1 pl-5">{item.mordes}</p>
                                                        </div>
                                                        <div className="mb-4">
                                                            <p className="text-[18px] font-semibold text-[#FF6500]"><span className="text-[#0B8494] mr-2"><FontAwesomeIcon icon={faLocationDot} /></span>{item.afterplan}</p>
                                                            <p className="mt-1 pl-5">{item.afterdes}</p>
                                                        </div>
                                                        <div className="">
                                                            <p className="text-[18px] font-semibold text-[#FF6500]"><span className="text-[#0B8494] mr-2"><FontAwesomeIcon icon={faLocationDot} /></span>{item.evenplan}</p>
                                                            <p className="mt-1 pl-5">{item.evendes}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center cursor-pointer">
                                <div className="bg-white py-8 px-4 rounded-lg shadow-lg w-[800px] h-[650px] text-center">
                                    <h2 className="text-2xl font-bold mb-10">Confirm Purchase</h2>
                                    <div className="flex">
                                        <div className="w-[35%] ml-[5%]">
                                            <p className="text-left font-semibold mb-3">Number of Passenger</p>
                                            <div>
                                                <label className="block text-left mb-1">Adult <sup className="text-[rgb(230,0,18)]">*</sup></label>
                                                <input
                                                    type="number"
                                                    value={adult}
                                                    onChange={(e) => setAdult(Number(e.target.value))}
                                                    className="w-full bg-[#dfdfdf] focus:outline-none rounded-sm font-montserrat py-1 px-2 border-2 border-solid border-[#ccc]" />
                                            </div>
                                            <div className="mt-5">
                                                <label className="block text-left mb-1">Children</label>
                                                <input
                                                    type="number"
                                                    value={children}
                                                    onChange={(e) => setChildren(e.target.value)}
                                                    className="w-full bg-[#dfdfdf] focus:outline-none rounded-sm font-montserrat py-1 px-2 border-2 border-solid border-[#ccc]" />
                                            </div>
                                            <div className="mt-5">
                                                <label className="block text-left mb-1">Baby</label>
                                                <input
                                                    type="number"
                                                    value={baby}
                                                    onChange={(e) => setBaby(e.target.value)}
                                                    className="w-full bg-[#dfdfdf] focus:outline-none rounded-sm font-montserrat py-1 px-2 border-2 border-solid border-[#ccc]" />
                                            </div>
                                            <div className="mt-8">
                                                <button
                                                    className="bg-[#FF6500] text-white py-2 px-4 rounded-lg mr-2"
                                                    onClick={handleConfirm}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    className="bg-gray-300 py-2 px-4 rounded-lg"
                                                    onClick={handleCloseModal}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-[45%] mx-[5%]">
                                            <div className="w-full h-[500px] rounded-t-lg border-2 border-solid border-[#ccc]">
                                                <img className="w-full h-[180px] rounded-t-md" src={tour.tourpath} />
                                                <div className="py-4 px-6">
                                                    <p className="text-[20px] font-montserrat font-bold tracking-wider text-[#0B8494]">{tour.tourname}</p>
                                                    <p className="text-[12px] font-semibold"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{tour.tourcode}</p>
                                                    <div className="flex mt-4">
                                                        <div className="w-[10%] space-y-2">
                                                            <p><FontAwesomeIcon icon={faPlaneDeparture} /></p>
                                                            <p><FontAwesomeIcon icon={faCalendarDays} /></p>
                                                            {adult && (
                                                                <p>
                                                                    <FontAwesomeIcon icon={faSackDollar} />
                                                                </p>
                                                            )}
                                                            {children && (
                                                                <p>
                                                                    <FontAwesomeIcon icon={faChild} />
                                                                </p>
                                                            )}
                                                            {baby && (
                                                                <p>
                                                                    <FontAwesomeIcon icon={faBaby} />
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="w-[90%] text-left space-y-[9px]">
                                                            <p>Departure: <b>{formatDate(tour.startdate)}</b></p>
                                                            <p>Total: <b>{tour.totaldate} days {tour.totaldate - 1} nights</b></p>
                                                            {adult && (
                                                                <p>
                                                                    Adult price: <b>{priceAdult}$ x {adult}</b>
                                                                </p>
                                                            )}
                                                            {children && (
                                                                <p>
                                                                    Children price: <b>{priceChildren}$ x {children}</b>
                                                                </p>
                                                            )}
                                                            {baby && (
                                                                <p>
                                                                    Baby price: <b>{priceBaby}$ x {baby}</b>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-left mt-4 ml-2 text-[1.125rem] space-y-2">
                                                        Total: <span className="text-[#FF6500] font-montserrat text-[1.8rem] font-bold tracking-wide">{totalAdult + totalChildren + totalBaby}</span>$
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>The selected tour does not exist</p>
            )}
        </div>
    )
}

export default TravelDetail;