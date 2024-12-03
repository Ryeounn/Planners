"use client"
import React, { useEffect, useState } from "react";
import "aos/dist/aos.css";
import { BsHexagonFill } from "react-icons/bs";
import AOS from "aos";

const MostAttractive = () => {
    useEffect(() => {
        AOS.init({
            once: true
        });
    }, []);

    return (
        <div>
            <div className="font-montserrat pt-[150px] pb-[100px] w-full overflow-hidden">
                <div className="text-center">
                    <h2 className="text-xl font-montserrat font-medium leading-[50px]">Most Attractive Place <br />
                        <span className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">
                            Indonesia
                        </span>
                    </h2>
                </div>
                <div className="flex justify-center mt-10 relative">
                    <div className="bg-[#0B8494] w-[1px] h-[750px] flex flex-col justify-around items-center">

                        <div className="relative flex items-center">
                            <BsHexagonFill className="text-[30px] rotate-[90deg] text-[#2fa8b9]" />
                            <p 
                            data-aos="fade-up"
                            data-aos-delay="500"
                            data-aos-duration="1200"
                            className="absolute w-[400px] left-[70px]">Bali is famous for its stunning beaches, vibrant culture, and lush landscapes, making it ideal for relaxation and adventure.</p>
                        </div>

                        <div className="relative flex items-center">
                            <BsHexagonFill className="text-[30px] rotate-[90deg] text-[#2fa8b9]" />
                            <p
                            data-aos="fade-up"
                            data-aos-delay="500"
                            data-aos-duration="1200"
                            className="absolute w-[400px] left-[70px] ">Yogyakarta is a cultural hotspot with UNESCO sites like Borobudur and rich arts, offering a glimpse into Javanese traditions.</p>
                        </div>

                        <img src="/assets/images/attractive/indonesiaLeft.jpg" alt=""
                            className="absolute top-[-180px] left-[-130px] w-[500px] h-[450px]"
                            data-aos="fade-right"
                            data-aos-delay="500"
                            data-aos-duration="1000"
                        />

                        <img src="/assets/images/attractive/indonesiaLeft1.jpg" alt=""
                            className="absolute top-[5%] left-[30%] w-[150px] h-[150px]"
                            data-aos="fade-right"
                            data-aos-delay="500"
                            data-aos-duration="1500"
                        />

                        <div className="relative flex items-center">
                            <BsHexagonFill className="text-[30px] rotate-[90deg] text-[#2fa8b9]" />
                            <p 
                            data-aos="fade-up"
                            data-aos-delay="500"
                            data-aos-duration="1200"
                            className="absolute w-[400px] right-[70px] text-right">The Komodo Islands are home to the Komodo dragon and offer fantastic diving opportunities in beautiful natural settings.</p>
                        </div>

                        <div className="relative flex items-center">
                            <BsHexagonFill className="text-[30px] rotate-[90deg] text-[#2fa8b9]" />
                            <p 
                            data-aos="fade-up"
                            data-aos-delay="500"
                            data-aos-duration="1200"
                            className="absolute w-[400px] right-[70px] text-right">Jakarta, Indonesias bustling capital, is known for its blend of modernity and tradition. Visitors can explore vibrant markets, diverse cuisines, and historical sites like the National Monument.</p>
                        </div>

                        <img src="/assets/images/attractive/indonesiaRight.jpg" alt=""
                            className="absolute top-[120px] right-[-150px] w-[500px] h-[450px]"
                            data-aos="fade-left"
                            data-aos-delay="500"
                            data-aos-duration="1000"
                        />

                        <img src="/assets/images/attractive/indonesiaRight1.jpg" alt=""
                            className="absolute top-[45%] right-[30%] w-[150px] h-[150px]"
                            data-aos="fade-left"
                            data-aos-delay="500"
                            data-aos-duration="1500"
                        />

                        <div className="relative flex items-center">
                            <BsHexagonFill className="text-[30px] rotate-[90deg] text-[#2fa8b9]" />
                            <p 
                            data-aos="fade-up"
                            data-aos-delay="500"
                            data-aos-duration="1200"
                            className="absolute w-[400px] left-[70px]">Ubud is Balis cultural center, known for rice terraces, art, yoga, and a peaceful atmosphere perfect for relaxation.</p>
                        </div>

                        <img src="/assets/images/attractive/indonesiaLeft2.jpg" alt=""
                            className="absolute top-[80%] left-[32%] w-[150px] h-[150px]"
                            data-aos="fade-right"
                            data-aos-delay="500"
                            data-aos-duration="1500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MostAttractive;