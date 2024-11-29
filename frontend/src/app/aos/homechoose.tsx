"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { faPhone, faUser, faStar, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import AOS from "aos";

const Choose = () => {
    useEffect(() => {
        AOS.init({
            once: true
        });
    }, []);
    return (
        <div className="grid grid-cols-4 gap-8 mt-10 px-8">
            <div className="p-4 text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="0">
                <div className="relative left-[60px] flex items-center justify-center w-[200px] h-[50px]">
                    <svg className="absolute" viewBox="0 0 200 200" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#F6C5CD" d="M41.1,-74C51.4,-65.2,56.6,-50.4,59,-37.1C61.5,-23.8,61.2,-11.9,58.8,-1.4C56.4,9.1,51.9,18.2,48.9,30.6C45.9,43,44.4,58.7,36.5,64.1C28.6,69.5,14.3,64.6,1.2,62.5C-11.8,60.3,-23.7,60.9,-34,56.9C-44.4,53,-53.2,44.4,-62.9,34.1C-72.5,23.9,-83,11.9,-82.1,0.5C-81.3,-10.9,-69,-21.8,-57.8,-29.5C-46.7,-37.1,-36.6,-41.5,-27.1,-50.8C-17.6,-60.1,-8.8,-74.3,3.3,-80C15.4,-85.7,30.8,-82.8,41.1,-74Z" transform="translate(100 100)" />
                    </svg>
                    <FontAwesomeIcon className="w-6 h-6 text-[20px] text-black z-10" icon={faPhone} />
                </div>
                <p className="font-[Arial] font-semibold text-[20px] mb-1">24/7 customer support</p>
                <p>No matter the time zone, we’re here to help.</p>
            </div>
            <div className="p-4 text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300">
                <div className="relative left-[60px] flex items-center justify-center w-[200px] h-[50px]">
                    <svg className="absolute" viewBox="0 0 200 200" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#D3F6EE" d="M41.1,-74C51.4,-65.2,56.6,-50.4,59,-37.1C61.5,-23.8,61.2,-11.9,58.8,-1.4C56.4,9.1,51.9,18.2,48.9,30.6C45.9,43,44.4,58.7,36.5,64.1C28.6,69.5,14.3,64.6,1.2,62.5C-11.8,60.3,-23.7,60.9,-34,56.9C-44.4,53,-53.2,44.4,-62.9,34.1C-72.5,23.9,-83,11.9,-82.1,0.5C-81.3,-10.9,-69,-21.8,-57.8,-29.5C-46.7,-37.1,-36.6,-41.5,-27.1,-50.8C-17.6,-60.1,-8.8,-74.3,3.3,-80C15.4,-85.7,30.8,-82.8,41.1,-74Z" transform="translate(100 100)" />
                    </svg>
                    <FontAwesomeIcon className="w-6 h-6 text-[20px] text-black z-10" icon={faUser} />
                </div>
                <p className="font-[Arial] font-semibold text-[20px] mb-1">Earn rewards</p>
                <p>Explore, earn, redeem, and repeat with our loyalty program.</p>
            </div>
            <div className="p-4 text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="600">
                <div className="relative left-[60px] flex items-center justify-center w-[200px] h-[50px]">
                    <svg className="absolute" viewBox="0 0 200 200" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#F6ECBB" d="M41.1,-74C51.4,-65.2,56.6,-50.4,59,-37.1C61.5,-23.8,61.2,-11.9,58.8,-1.4C56.4,9.1,51.9,18.2,48.9,30.6C45.9,43,44.4,58.7,36.5,64.1C28.6,69.5,14.3,64.6,1.2,62.5C-11.8,60.3,-23.7,60.9,-34,56.9C-44.4,53,-53.2,44.4,-62.9,34.1C-72.5,23.9,-83,11.9,-82.1,0.5C-81.3,-10.9,-69,-21.8,-57.8,-29.5C-46.7,-37.1,-36.6,-41.5,-27.1,-50.8C-17.6,-60.1,-8.8,-74.3,3.3,-80C15.4,-85.7,30.8,-82.8,41.1,-74Z" transform="translate(100 100)" />
                    </svg>
                    <FontAwesomeIcon className="w-6 h-6 text-[20px] text-black z-10" icon={faStar} />
                </div>
                <p className="font-[Arial] font-semibold text-[20px] mb-1">Millions of reviews</p>
                <p>Plan and book with confidence using reviews from fellow travelers.</p>
            </div>

            <div className="p-4 text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="900">
                <div className="relative left-[60px] flex items-center justify-center w-[200px] h-[50px]">
                    <svg className="absolute" viewBox="0 0 200 200" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#DEECED" d="M41.1,-74C51.4,-65.2,56.6,-50.4,59,-37.1C61.5,-23.8,61.2,-11.9,58.8,-1.4C56.4,9.1,51.9,18.2,48.9,30.6C45.9,43,44.4,58.7,36.5,64.1C28.6,69.5,14.3,64.6,1.2,62.5C-11.8,60.3,-23.7,60.9,-34,56.9C-44.4,53,-53.2,44.4,-62.9,34.1C-72.5,23.9,-83,11.9,-82.1,0.5C-81.3,-10.9,-69,-21.8,-57.8,-29.5C-46.7,-37.1,-36.6,-41.5,-27.1,-50.8C-17.6,-60.1,-8.8,-74.3,3.3,-80C15.4,-85.7,30.8,-82.8,41.1,-74Z" transform="translate(100 100)" />
                    </svg>
                    <FontAwesomeIcon className="w-6 h-6 text-[20px] text-black z-10" icon={faCalendarDays} />
                </div>
                <p className="font-[Arial] font-semibold text-[20px] mb-1">Plan your way</p>
                <p>Stay flexible with free cancellation and the option to reserve now and pay later at no additional cost.</p>
            </div>
        </div>
    )
}

export default Choose;
