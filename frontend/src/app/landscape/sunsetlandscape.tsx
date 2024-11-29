'use client';
import React, { useEffect } from "react";
import AOS from "aos";

const Sunset = () => {
    useEffect(() => {
        AOS.init({
            once: true
        });
    }, [])

    return (
        <div className="mx-52">
            <div className="grid grid-cols-6 gap-4 my-10">
                <div className="text-center">
                    <img
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="0"
                        className="w-[150px] h-[200px] rounded-[70px] inline-block"
                        src="/assets/images/sunset/sunset1.jpg" />
                    <p
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                        className="mt-3 text-center">Tower</p>
                </div>
                <div className="text-center">
                    <img
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                        className="w-[150px] h-[200px] rounded-[70px] inline-block"
                        src="/assets/images/sunset/sunset2.jpg" />
                    <p
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="400"
                        className="mt-3 text-center">Desert</p>
                </div>
                <div className="text-center">
                    <img
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="400"
                        className="w-[150px] h-[200px] rounded-[70px] inline-block"
                        src="/assets/images/sunset/sunset3.jpg" />
                    <p
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="600"
                        className="mt-3 text-center">Beach</p>
                </div>
                <div className="text-center">
                    <img
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="600"
                        className="w-[150px] h-[200px] rounded-[70px] inline-block"
                        src="/assets/images/sunset/sunset4.jpg" />
                    <p
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="800"
                        className="mt-3 text-center">Temple</p>
                </div>
                <div className="text-center">
                    <img
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="800"
                        className="w-[150px] h-[200px] rounded-[70px] inline-block"
                        src="/assets/images/sunset/sunset5.jpg" />
                    <p
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="1000"
                        className="mt-3 text-center">Mountain</p>
                </div>
                <div className="text-center">
                    <img
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="1000"
                        className="w-[150px] h-[200px] rounded-[70px] inline-block"
                        src="/assets/images/sunset/sunset6.jpg" />
                    <p
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="1200"
                        className="mt-3 text-center">Pyramid</p>
                </div>
            </div>
        </div>
    )
}

export default Sunset;