import React from "react";
import Navbar from "./layout/navbar";
import Header from "./layout/header";
import MostAttractive from "./mostattractive/mostattractive";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUser, faStar, faCalendarDays, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DestinationSlider from "./destination/destinationsilde";
import AOS from "aos";
import ViewPoint from "./viewpoint/viewpoint";
import Choose from "./aos/homechoose";
import Sunset from "./landscape/sunsetlandscape";
import Gallery from "./gallery/gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Planner your trip',
  description: 'Planners is a company specializing in offering a variety of travel tours, providing unique and high-quality travel experiences for customers. We are committed to organizing memorable, safe, and dedicated journeys from planning to execution.',
}
const Home = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div id="h_choose" className="w-full h-full relative">
        <h2 className="text-center text-3xl font-semibold">
          Sunset landscape
        </h2>
        <Sunset />
        <h2 className="text-center text-3xl font-semibold">
          Why choose Planners?
        </h2>
        <Choose />
        <div id="h_destination" className="w-full h-[700px] mt-10 pb-[42%]">
          <h2 className="text-center text-3xl font-semibold">
            Outstanding destination
          </h2>
          <div className="relative mt-[23%] mx-2 rounded-[10px]">
            <DestinationSlider />
          </div>
        </div>
        <div id="h_schedule">
          <MostAttractive />
        </div>
        <div id="h_viewpoint">
          <ViewPoint />
        </div>
        <div id="h_gallery">
          <Gallery />
        </div>
      </div>
    </div>
  );
}

export default Home;
