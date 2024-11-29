import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faXTwitter, faPinterestP, faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faLocationDot, faPhone, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
    return (
        <div className="w-full bg-black mt-10">
            <footer className="text-white py-6">
                <div className="container mx-auto px-16">
                    <div className="text-center">
                        <div className="text-[30px] w-[20%] flex items-center justify-around mx-auto mt-10">
                            <FontAwesomeIcon className="cursor-pointer" icon={faFacebookF} />
                            <FontAwesomeIcon className="cursor-pointer" icon={faXTwitter} />
                            <FontAwesomeIcon className="cursor-pointer" icon={faPinterestP} />
                            <FontAwesomeIcon className="cursor-pointer" icon={faInstagram} />
                            <FontAwesomeIcon className="cursor-pointer" icon={faYoutube} />
                            <FontAwesomeIcon className="cursor-pointer" icon={faTiktok} />
                        </div>
                    </div>
                    <div className="w-[80%] mr-[5%] ml-[15%]">
                        <div className="grid grid-cols-4 gap-4 mt-14">
                            <Link href="/">
                                <div className="text-[28px] font-semibold text-left">Planners.</div>
                            </Link>
                            <div className="text-[28px] font-semibold text-left">Links</div>
                            <div className="text-[28px] font-semibold text-left">Address</div>
                            <Link href="/tours">
                                <div className="text-[28px] font-semibold text-left">News</div>
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-5">
                            <div>
                                Get ready for your next adventure
                            </div>
                            <Link href="/contact">
                                <div className="hover:underline text-left">Home</div>
                            </Link>
                            <div>
                                <div className="text-left"><FontAwesomeIcon icon={faLocationDot} /> Can Tho, Vietnam - 900000</div>
                            </div>
                            <div>
                                <div>
                                    Subscribe for latest updates
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-5">
                            <div></div>
                            <Link href="/contact">
                                <div className="hover:underline text-left">Destination</div>
                            </Link>
                            <div>
                                <div className="text-left"><FontAwesomeIcon icon={faPhone} /> 0707-181-293</div>
                            </div>
                            <div></div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-5">
                            <div></div>
                            <Link href="/contact">
                                <div className="hover:underline text-left">Travel</div>
                            </Link>
                            <div>
                                <div className="text-left"><FontAwesomeIcon icon={faEnvelope} /> phangialac2406@gmail.com</div>
                            </div>
                            <div></div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-5">
                            <div></div>
                            <Link href="/blog">
                                <div className="hover:underline text-left">Blog</div>
                            </Link>
                            <div>
                                <div className="text-left"><FontAwesomeIcon icon={faClock} /> 7:00 am - 10:00 pm</div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-gray-100 mt-10"></div>
                    <div className="w-full flex justify-between">
                        <div className="italic mt-4">
                            Design by Tyrar
                        </div>
                        <div className="text-center mt-4">
                            <p>&copy; 2024 Planners. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer;