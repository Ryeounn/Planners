"use client";

import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Destination {
    name: string;
    description: string;
    image: string;
}

const destinations: Destination[] = [
    {
        name: 'Italy',
        description: 'Italy is famous for its art, history, and delicious food. Explore cities like Rome, Venice, and Florence, where you can see landmarks like the Colosseum and enjoy pizza and pasta in a romantic setting.',
        image: '/assets/images/destination/italy.jpg',
    },
    {
        name: 'Korea',
        description: 'South Korea blends tradition with modernity. Discover ancient temples and vibrant city life, and don’t miss trying kimchi and Korean BBQ for a taste of its rich culinary culture.',
        image: '/assets/images/destination/korea.jpg',
    },
    {
        name: 'Taiwan',
        description: 'Taiwan is a beautiful island known for stunning landscapes and diverse culture. In Taipei, visit Taipei 101 and enjoy the lively atmosphere and street food at Shilin Night Market.',
        image: '/assets/images/destination/taiwan.jpg',
    },
    {
        name: 'Vietnam',
        description: 'Vietnam offers diverse culture and breathtaking nature. From Ha Long Bay to the Mekong Delta, experience its rich heritage and savor dishes like pho and bun cha, all while enjoying the hospitality of locals.',
        image: '/assets/images/destination/vietnam.jpg',
    },
    {
        name: 'Australia',
        description: 'Australia is known for its beautiful beaches, unique wildlife, and cultural diversity. Visit Sydney’s Opera House and explore Melbourne’s arts scene, while also enjoying its national parks and stunning coastlines.',
        image: '/assets/images/destination/australia.jpg',
    },
    {
        name: 'Germany',
        description: 'Germany is rich in history and architecture. From Berlin\'s famous wall to Bavaria\'s castles, explore its unique culture. Enjoy traditional German cuisine, including sausages and pretzels.',
        image: '/assets/images/destination/germany.jpg',
    },
];

const DestinationSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const slideRef = useRef<HTMLDivElement>(null);

    const handleNext = () => {
        if (slideRef.current) {
            const items = slideRef.current.children;
            if (items.length > 0) {
                slideRef.current.appendChild(items[0]);
            }
        }
    };

    const handlePrev = () => {
        if (slideRef.current) {
            const items = slideRef.current.children;
            if (items.length > 0) {
                slideRef.current.prepend(items[items.length - 1]);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    useEffect(() => {
        if (isTransitioning) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setPrevIndex(null);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    return (
        <div>
            <div className="containers rounded-[10px] mt-10">
                <div className="slide" ref={slideRef}>
                    {destinations.map((destination, index) =>(
                        <div key={index} className="item" style={{ backgroundImage: `url(${destination.image})` }}>
                        <div className="content">
                            <div className="name font-montserrat">{destination.name}</div>
                            <div className="des">{destination.description}</div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="button">
                    <button className="prev text-white !border-white" onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <button className="next text-white !border-white" onClick={handleNext}><FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
            </div>
        </div>
    );
};

export default DestinationSlider;
