'use client';
import React, { useEffect } from "react";
import AOS from "aos";

const Gallery = () => {
    useEffect(() =>{
        AOS.init({
            once: true
        });
    },[]);

    return (
        <div className="mt-20">
            <div className="text-center">
                <h2 className="text-xl font-montserrat font-medium leading-[50px]">Photo library</h2>
                <h1 className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">WORLDWIDE</h1>
            </div>
            <div className="flex mx-10 mt-10">
                <div className="w-[59%] mr-[1%]">
                    <div className="rows">
                        <div
                         data-aos="fade-up"
                         data-aos-duration="1000"
                         data-aos-delay="500"
                         className="col-umn">
                            <div className="image-container">
                                <img src="/assets/images/galery/1.jpg" />
                                <div className="country-name">Turkey</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/2.jpg" />
                                <div className="country-name">Dubai</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/3.jpg" />
                                <div className="country-name">Hawaii</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/4.jpg" />
                                <div className="country-name">Switzerland</div>
                            </div>
                        </div>

                        <div
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="600"
                         className="col-umn">
                            <div className="image-container">
                                <img src="/assets/images/galery/8.jpg" />
                                <div className="country-name">Japan</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/9.jpg" />
                                <div className="country-name">China</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/10.jpg" />
                                <div className="country-name">Italy</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/11.jpg" />
                                <div className="country-name">Usa</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/12.jpg" />
                                <div className="country-name">Indonesia</div>
                            </div>
                        </div>

                        <div 
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="700"
                        className="col-umn">
                            <div className="image-container">
                                <img src="/assets/images/galery/14.jpg" />
                                <div className="country-name">Maldives</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/15.jpg" />
                                <div className="country-name">Germany</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/16.jpg" />
                                <div className="country-name">Japan</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/17.jpg" />
                                <div className="country-name">Usa</div>
                            </div>
                        </div>

                        <div
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="800"
                        className="col-umn">
                            <div className="image-container">
                                <img src="/assets/images/galery/21.jpg" />
                                <div className="country-name">Netherland</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/22.jpg" />
                                <div className="country-name">Usa</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/23.jpg" />
                                <div className="country-name">France</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/24.jpg" />
                                <div className="country-name">Poland</div>
                            </div>
                        </div>

                        <div
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="900"
                        className="col-umn">
                            <div className="image-container">
                                <img src="/assets/images/galery/7.jpg" />
                                <div className="country-name">Thailand</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/13.jpg" />
                                <div className="country-name">Canada</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/19.jpg" />
                                <div className="country-name">Thailand</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/20.jpg" />
                                <div className="country-name">Seoul</div>
                            </div>
                        </div>

                        <div
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="1000"
                        className="col-umn">
                            <div className="image-container">
                                <img src="/assets/images/galery/5.jpg" />
                                <div className="country-name">Switzerland</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/6.jpg" />
                                <div className="country-name">China</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/25.jpg" />
                                <div className="country-name">Greece</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/26.jpg" />
                                <div className="country-name">Thailand</div>
                            </div>
                            <div className="image-container">
                                <img src="/assets/images/galery/kohphiphi1.jpg" />
                                <div className="country-name">Thailand</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[39%] ml-[1%] flex items-center justify-center text-center">
                    <div className="text-xl font-montserrat">
                        <div
                        data-aos="fade-down"
                        data-aos-duration="1000"
                        data-aos-delay="500"
                        className="leading-[50px] font-semibold">
                            Discover the World Through Our Travel Image Gallery
                        </div>
                        <div
                        data-aos="fade-down"
                        data-aos-duration="1000"
                        data-aos-delay="700"
                        className="text-[15px] font-normal">
                            Step into our travel image gallery and immerse yourself in the diverse beauty of the world. Each photograph tells a story, a magical journey through famous landmarks, pristine beaches, majestic mountain ranges, and bustling cities.
                            Explore the wonders of our planet and get inspired for your next adventure!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gallery;