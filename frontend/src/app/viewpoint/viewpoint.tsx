"use client"
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import AOS from 'aos';

const ViewPoint = () => {
    const [img, setImg] = useState<number>(0);
    const [imgVisible, setImgVisible] = useState<Boolean>(true);
    const [places, setPlaces] = useState<any>([]);
    const [expandedIndex, setExpandedIndex] = useState<any>(null);

    const handleToggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    useEffect(() => {
        AOS.init({
            once: true
        });
    }, []);

    useEffect(() => {
        const listAttractive = async () => {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/home_viewpoint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data) {
                setPlaces(data);
                console.log(data);
            } else {
                console.log('>>> error get list attractive');
            }
        }

        listAttractive();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setImgVisible(true);
        }, 500);
        return () => clearTimeout(timeout);
    }, [img]);

    const formatDate = (dateString: string, daysToAdd: number): string => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString();
    };

    const handleSelected = (index: number) => {
        setImgVisible(true);
        setImg(index);
    }

    const handleImages = (img: number) => {
        switch (img) {
            case 0:
                return '/assets/images/viewpoint/img1.jpg';
            case 1:
                return '/assets/images/viewpoint/img2.jpg';
            case 2:
                return '/assets/images/viewpoint/img3.jpg';
            case 3:
                return '/assets/images/viewpoint/img4.jpg';
        }
    }

    const imgSrc = handleImages(img);

    return (
        <div className="mt-[50px]" id="h_viewport">
            <div className="text-center">
                <h2 className="text-xl font-montserrat font-medium leading-[50px]">Discover Our Tourist</h2>
                <h1 className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">INDONESIA</h1>
            </div>

            <div className="flex justify-between items-center mt-[50px] mx-6">
                <div className="w-[40%] flex flex-col gap-2 pl-[50px]">
                    {
                        [1, 2, 3, 4].map((item, i) => (
                            <div
                                data-aos="fade-right"
                                data-aos-duration="800"
                                data-aos-delay="0"
                                key={i}
                                onClick={() => handleSelected(i)}
                                className={`${img === i ? "border-[#00A1B9]" : "border-transparent"} border-[6px] ml-[-50px] pl-[100px] py-2 z-[99] relative cursor-pointer`}>
                                {places[i] && (
                                    <div onClick={() => handleToggleExpand(i)}>
                                        <div
                                            key={places[i].scheduleid} className="flex gap-10">
                                            <div>
                                                <div>
                                                    <h3 className="text-[17px] font-semibold">{places[i].morplan} - {places[i].afterplan} - {places[i].evenplan}</h3>
                                                    <p>- {places[i].mordes}</p>
                                                    {expandedIndex === i && (
                                                        <div className="mb-2">
                                                            <p>- {places[i].afterdes}</p>
                                                            <p>- {places[i].evendes}</p>
                                                        </div>
                                                    )}
                                                    <div className="flex mt-4">
                                                        <img src="/assets/images/viewpoint/angle.png" width={200} />
                                                        <button onClick={() => handleToggleExpand(i)} className="text-[14px] bg-[#00A1B9] text-white px-3 rounded-md hover:bg-[#0B8494] transition-colors duration-150">{expandedIndex === i ? 'View less' : 'View more'}</button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        {
                                            img === i &&
                                            <p className="absolute left-0 top-[5px] text-[18px] font-semibold flex items-center gap-1 justify-center verticleText">
                                                {i === 0 ? formatDate(places[i].tour.startdate, 0) : formatDate(places[i].tour.startdate, i)}
                                            </p>
                                        }
                                    </div>
                                )}


                            </div>
                        ))
                    }
                </div>
                <div className="w-[60%] viewPointImg">
                    <img key={imgSrc} data-aos="zoom-in" src={imgSrc} alt="" className={`h-[650px] w-full rounded-[10px] ml-3 ${imgVisible ? "" : "fade-out"}`} />
                </div>
            </div>
        </div>
    )
}

export default ViewPoint;