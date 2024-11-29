import Header from "./header";
import Navbar from "../layout/navbar";
import BookingOfUser from "./booking";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Your bookings',
    description: 'Your brilliant journeys',
}

const Booking = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="w-[90%] mx-[5%]">
                <div>
                    <p>
                        <Link className="text-[#4B70F5]" href='/'>Home </Link>
                        <span>/ </span>
                        Booking
                    </p>
                </div>
                <div id="b_content" className="mt-5">
                    <BookingOfUser />
                </div>
            </div>
        </div>
    )
}

export default Booking;