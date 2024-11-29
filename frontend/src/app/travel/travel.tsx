'use client';
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAngleRight, faLocationDot, faL, faTag, faHeart, faXmarkCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'sonner';
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Search = () => {
    const [region, setRegion] = useState<any>([]);
    const [city, setCity] = useState<any>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [history, setHistory] = useState<any>([]);
    const [tourid, setTourid] = useState<number>(0);
    const [tour, setTour] = useState<any>([]);
    const [group, setGroup] = useState<any>([]);
    const [quantity, setQuantity] = useState<any>([]);
    const locationModalRef = useRef<HTMLDivElement>(null);
    const dateModalRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState<string>('');
    const [createForm, setCreateForm] = useState<boolean>(false);
    const [showList, setShowList] = useState<boolean>(false);
    const [userId, setUserId] = useState<any>('');
    const [latestWishlistIds, setLatestWishlistIds] = useState<any>([]);
    const [wishlistTours, setWishlistTours] = useState<number[]>([]);
    const [fetchDataTrigger, setFetchDataTrigger] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 4;
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = tour.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tour.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const [currentH, setCurrentH] = useState<number>(1);
    const itemPerHistory: number = 4;
    const indexOfLastHistory = currentH * itemPerHistory;
    const indexOfFirstHistory = indexOfLastHistory - itemPerHistory;
    const currentHistories = history.slice(indexOfFirstHistory, indexOfLastHistory);
    const pageHistories = [];
    for (let i = 1; i <= Math.ceil(history.length / itemPerHistory); i++) {
        pageHistories.push(i);
    }

    const router = useRouter();

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/groupwishlist/getAllByUserId`, {
            userid: userId
        }).then(res => {
            setGroup(res.data);
            res.data.forEach((groupItem: any) => {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/findWishListLastest`, {
                    groupwishlistid: groupItem.groupwishlistid
                }).then(response => {
                    setLatestWishlistIds((prevPaths: any) => ({
                        ...prevPaths,
                        [groupItem.groupwishlistid]: response.data?.tour?.tourpath || ''
                    }));
                    res.data.forEach((groupItem: any) => {
                        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/countAllWistlistByGroup`, {
                            groupwishlistid: groupItem.groupwishlistid
                        }).then(response => {
                            setQuantity((prevCounts: any) => ({
                                ...prevCounts,
                                [groupItem.groupwishlistid]: response.data
                            }));
                        }).catch(error => {
                            console.log(`Error fetching count for groupwishlistid ${groupItem.groupwishlistid}: ` + error);
                        });
                    });
                }).catch(error => {
                    console.log('Error fetching wishlist data: ' + error);
                });
            });
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [fetchDataTrigger, userId]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/region/getAllRegion`)
            .then(res => {
                setRegion(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [])

    const handleClick = (regionname: string) => {
        setIsLocationModalOpen(true);
        setIsDateModalOpen(false);
        setSelectedRegion(regionname);
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/city/getCityByRegionId`, {
            name: regionname
        }).then(res => {
            setCity(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    };

    const handleCityClick = (cityname: string) => {
        setSelectedCity(cityname);
        setIsDateModalOpen(true);
    };

    const handleCreateWishList = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';

        if (!name) {
            errorMessage += 'Group name cannot be blank.\n';
        }

        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }

        const createData = {
            userId: userId,
            name: name
        }

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/groupwishlist/createGroupwishlist`, createData)
            .then(res => {
                if (res.data.success) {
                    const successMessage = 'Created Group successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    router.refresh();
                    setCreateForm(false);
                    setName('');
                    setFetchDataTrigger(!fetchDataTrigger);
                    setShowList(true);
                } else {
                    const failMessage = 'Created Group fail';
                    toast.error(failMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                }
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }

    useEffect(() => {
        if (selectedCity !== null) {
            setIsLocationModalOpen(false);
        }
    }, [selectedCity]);

    const handleOpenLocationModal = () => {
        setIsLocationModalOpen(true);
        setIsDateModalOpen(false);
    };

    const handleOpenDateModal = () => {
        setIsDateModalOpen(true);
        setIsLocationModalOpen(false);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setIsDateModalOpen(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userid = sessionStorage.getItem('user');
            if (userid) {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/history/findAllByUserId`, {
                    userid: userid
                }).then(res => {
                    setUserId(userid);
                    setHistory(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
            }
        };
    }, []);

    const handleSearch = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");

        if (selectedCity === null || selectedDate === null) {
            let message = "Your ";

            if (selectedCity === null) {
                message += "DESTINATION ";
            }

            if (selectedDate === null) {
                message += "DEPARTURE DATE ";
            }

            message += "is empty";
            if (selectedCity === null && selectedDate === null) {
                message = "Your DESTINATION and DEPARTURE DATE are empty";
            }

            toast(message, {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        } else {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tourprice/findTourByNationAndDate`, {
                nation: selectedCity,
                startDate: selectedDate
            }).then(res => {
                setTour(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isLocationModalOpen && locationModalRef.current && !locationModalRef.current.contains(event.target as Node)) {
                setIsLocationModalOpen(false);
            }
            if (isDateModalOpen && dateModalRef.current && !dateModalRef.current.contains(event.target as Node)) {
                setIsDateModalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLocationModalOpen, isDateModalOpen]);

    const handleShowForm = (tourid: number) => {
        setTourid(tourid);
        setShowList(true);
    }

    const handleCloseShowForm = () => {
        setShowList(false);
    }

    const handleCreateForm = () => {
        setCreateForm(true);
        setShowList(false);
    }

    const handleCloseCreateForm = () => {
        setCreateForm(false);
        setShowList(true);
    }

    const handleAddWishlist = (groupwishlistid: number) => {
        if (tourid !== 0) {
            const createData = {
                tourid: tourid,
                groupwishlistid: groupwishlistid
            }

            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/createWishlist`, createData)
                .then(res => {
                    const currentDate = new Date();
                    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                    if (res.data.success) {
                        const successMessage = 'Add Wishlist successfully';
                        toast.success(successMessage, {
                            description: formattedDate,
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        });
                        router.refresh();
                        setFetchDataTrigger(!fetchDataTrigger);
                        setWishlistTours(prevState => [...prevState, tourid]);
                        setShowList(false);
                    } else {
                        const failMessage = 'Add Wishlist fail';
                        toast.error(failMessage, {
                            description: formattedDate,
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        });
                    }
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }
    }

    const handleRemoveWishlist = (tourid: number) => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        const deleteData = {
            userid: userId,
            tourid: tourid
        }
        if (deleteData) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/deleteTourWishList`, deleteData)
                .then(res => {
                    const successMessage = 'Delete Tour successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setFetchDataTrigger(!fetchDataTrigger);
                    setWishlistTours((prevTours) => prevTours.filter(id => id !== tourid));
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }
    }

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/getAllWishlistUser`, {
            userid: userId
        }).then(res => {
            console.log(res.data)
            if (res.data && Array.isArray(res.data)) {
                const tourIds = res.data.map((item: any) => item.tour.tourid);
                setWishlistTours(tourIds);
            } else {
                console.log("No wishlist tours found");
            }
        }).catch(err => {
            console.log('Error fetching wishlist data:', err);
        });
    }, [userId]);

    return (
        <div>
            <div className="h-full flex justify-center">
                <div className="w-[50%] h-[80px] rounded-[30px] border-2 border-solid border-[#ccc]">
                    <div className="flex justify-center items-center w-full">
                        <div className="flex items-center bg-white rounded-[30px] shadow-lg px-4 py-2 w-full h-[76px] relative">
                            <div
                                className="flex flex-col w-[45%] cursor-pointer focus:outline-none"
                                onClick={handleOpenLocationModal}
                                ref={locationModalRef}
                            >
                                <span className="text-sm font-semibold text-gray-600">Location</span>
                                <input
                                    type="text"
                                    placeholder="Where are you going?"
                                    className="text-sm mt-1 text-gray-500 focus:outline-none"
                                    value={selectedCity || ''}
                                    readOnly
                                />
                                {isLocationModalOpen && (
                                    <div className="absolute top-[80px] left-0 w-full h-[calc(100% + 100px)] bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-10">
                                        <div className="flex">
                                            <div className="space-y-6 w-[45%]">
                                                {region.map((item: any) => (
                                                    <div key={item.regionname}
                                                        className={`flex justify-between items-center py-2 px-4 cursor-pointer rounded-lg ${selectedRegion === item.regionname ? 'bg-[#dfdfdf]' : 'hover:bg-[#dfdfdf]'
                                                            }`}
                                                        onClick={() => handleClick(item.regionname)}>
                                                        <div className="flex items-center">
                                                            <img className="w-[80px] h-[50px] rounded-lg" src={item.regionpath} />
                                                            <p className="text-[16px] text-[#0B8494] font-semibold uppercase ml-2">{item.regionname}</p>
                                                        </div>
                                                        <div>
                                                            <FontAwesomeIcon className="text-[20px]" icon={faAngleRight} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-x-4 space-y-2 w-[54%] ml-[1%]">
                                                {city.map((item: any) => (
                                                    <div key={item.cityname}
                                                        className={`flex items-center ml-0 py-4 px-4 first:mx-4 first:w-[95.5%] rounded-lg cursor-pointer ${selectedCity === item.cityname ? 'bg-[#dfdfdf]' : 'hover:bg-[#dfdfdf]'
                                                            }`}
                                                        onClick={() => handleCityClick(item.cityname)}
                                                    >
                                                        <FontAwesomeIcon className="mr-3 text-[#0B8494]" icon={faLocationDot} />
                                                        <p className="font-semibold">{item.cityname}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-l border-gray-300 h-full mr-3"></div>

                            <div
                                className="flex flex-col w-[45%] cursor-pointer"
                                onClick={handleOpenDateModal}
                                ref={dateModalRef}
                            >
                                <span className="text-sm font-semibold text-gray-600">Departure date</span>
                                <input
                                    type="date"
                                    placeholder="Choose date..."
                                    className="text-sm mt-1 text-gray-500 w-fit focus:outline-none cursor-pointer"
                                    onFocus={() => setIsDateModalOpen(true)}
                                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                                />
                            </div>
                            <div className="flex items-center justify-center w-[10%]">
                                <button
                                    type="button"
                                    className="bg-red-500 py-4 px-5 rounded-[50px] text-white hover:bg-red-600"
                                    onClick={handleSearch}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="grid grid-cols-4 gap-4">
                    {currentProducts.map((item: any) => (
                        <div key={item.tourid} className="group cursor-pointer">
                            <div key={item.tourid} className="group cursor-pointer">
                                <div className="relative">
                                    <FontAwesomeIcon
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (wishlistTours.includes(item.tourid)) {
                                                handleRemoveWishlist(item.tourid);
                                            } else {
                                                handleShowForm(item.tourid);
                                            }
                                        }}
                                        className={`absolute top-2 right-3 py-3 px-3 bg-white rounded-[50%] z-[99] cursor-pointer 
                                            ${wishlistTours.includes(item.tourid) ? 'text-[rgb(230,0,18)]' : 'text-[#ccc]'}`}
                                        icon={faHeart}
                                    />

                                    <Link href={`/travel/${item.tourname.replace(/\s+/g, '-')}-${item.tourid}`}>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <div className="relative">
                                                <img
                                                    className="w-full h-[250px] rounded-lg transition-all duration-500 relative group-hover:z-10 group-hover:-translate-y-5"
                                                    src={item.tourpath}
                                                />
                                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:z-20 group-hover:-translate-y-5 transition-all duration-500 rounded-lg">
                                                    <div className="text-white text-[24px] font-bold uppercase">
                                                        {item.nation}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative -top-16 w-[95%] ml-[2.5%] mr-[2.5%] h-[200px] bg-white shadow-lg py-3 rounded-lg !z-0">
                                                <div className="text-[18px] uppercase text-center font-bold bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent border-x-4 border-solid border-[#0B8494]">
                                                    {item.tourname}
                                                </div>
                                                <div className="py-2 px-4 text-left">
                                                    {item.descrip}
                                                </div>
                                                <div className="mt-10">
                                                    <div className="w-full absolute bottom-5 flex justify-center items-center">
                                                        <div className="w-[50%] border-r-[.5px] border-solid border-[#ccc] text-center">
                                                            <FontAwesomeIcon className="mr-2 text-[#0B8494]" icon={faLocationDot} />
                                                            {item.nation}
                                                        </div>
                                                        <div className="w-[50%] border-l-[.5px] border-solid border-[#ccc] text-center">
                                                            <FontAwesomeIcon className="mr-2 text-[#0B8494]" icon={faTag} />
                                                            {item.totaldate} days
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center m-[10px_0] p-[10px_0]">
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`mx-1 ${number === currentPage ? 'bg-[#000000] text-[#fff] rounded-[50%] font-bold w-[40px] h-[40px] p-[5px]' : 'bg-[#eee] text-[#374151] rounded-[50%] w-[40px] h-[40px] p-[5px] '} hover:bg-[#89bde7] hover:text-[#000]`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                {showList && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999] cursor-pointer" onClick={handleCloseShowForm}>
                        <div className="custom-slide-modal bg-white rounded-lg shadow-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div>
                                    <FontAwesomeIcon onClick={handleCloseShowForm} className="text-[24px]" icon={faXmarkCircle} />
                                </div>
                            </div>
                            {userId ? (
                                <div>
                                    <h2 className="modal-title text-2xl font-bold mb-4 text-black">Add to wishlist</h2>
                                    <div className="w-full h-[540px] overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-2">
                                            <div
                                                onClick={handleCreateForm}
                                                className="flex items-center py-[14px] px-5 h-[100px] border-[1px] border-solid border-[#ccc] rounded-lg shadow-md">
                                                <div className="w-[70px] h-[70px] rounded-md bg-[#ccc]">
                                                    <div className="flex items-center justify-center relative top-5">
                                                        <FontAwesomeIcon className="text-[32px] text-white" icon={faPlus} />
                                                    </div>
                                                </div>
                                                <div className="ml-5 text-[18px] font-bold">New wishlist</div>
                                            </div>
                                            {group.map((item: any) => (
                                                <div key={item.groupwishlistid}
                                                    onClick={() => handleAddWishlist(item.groupwishlistid)}
                                                    className="flex items-center py-[14px] px-5 h-[100px] border-[1px] border-solid border-[#ccc] rounded-lg shadow-md">
                                                    <div className="w-[70px] h-[70px] rounded-md bg-[#ccc]">
                                                        {latestWishlistIds[item.groupwishlistid] ? (
                                                            <img src={latestWishlistIds[item.groupwishlistid]} alt="Tour Image" className="w-full h-full object-cover rounded-lg" />
                                                        ) : (
                                                            <img src="/assets/images/app/wishlistempty.jpg" alt="Empty Wishlist" className="w-full h-full object-cover rounded-lg" />
                                                        )}
                                                    </div>
                                                    <div className="ml-5 flex flex-col">
                                                        <div className="text-[18px] font-bold">{item.groupname}</div>
                                                        <p className="mt-1 text-[14px] text-gray-600">
                                                            {quantity[item.groupwishlistid] !== undefined
                                                                ? `${quantity[item.groupwishlistid]} experiences`
                                                                : '0 experiences'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="font-semibold text-center">Vui lòng đăng nhập để sử dụng danh sách yêu thích</p>
                            )}
                        </div>
                    </div>
                )}
                {createForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] cursor-pointer" onClick={handleCloseCreateForm}>
                        <div className="custom-slide-modal bg-white rounded-lg shadow-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div>
                                    <FontAwesomeIcon onClick={handleCloseCreateForm} className="text-[24px]" icon={faXmarkCircle} />
                                </div>
                            </div>
                            <h2 className="modal-title text-xl font-bold mb-4 text-black">Name your wishlist</h2>
                            <form>
                                <div className="text-black mt-8">
                                    <input
                                        type="text"
                                        className="w-full py-2 px-3 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-none"
                                        placeholder="Enter group name..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <div
                                        onClick={handleCreateWishList}
                                        className="w-fit h-fit py-2 px-8 mt-5 font-semibold rounded-md text-white bg-[#0B8494]">
                                        Create wishlist
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-12">
                <div className="font-montserrat pt-[150px] pb-[100px] w-full overflow-hidden">
                    <div className="text-center">
                        <h2 className="text-xl font-montserrat font-medium leading-[50px]">Tours You've Seen <br />
                            <span className="text-7xl font-serif uppercase tracking-wider bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent">
                                History
                            </span>
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {currentHistories.map((item: any) => (
                        <div key={item.tour.tourid} className="group cursor-pointer">
                            <div className="relative">
                                <FontAwesomeIcon
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (wishlistTours.includes(item.tour.tourid)) {
                                            handleRemoveWishlist(item.tour.tourid);
                                        } else {
                                            handleShowForm(item.tour.tourid);
                                        }
                                    }}
                                    className={`absolute top-2 right-3 py-3 px-3 bg-white rounded-[50%] z-[99] cursor-pointer 
                                        ${wishlistTours.includes(item.tour.tourid) ? 'text-[rgb(230,0,18)]' : 'text-[#ccc]'}`}
                                    icon={faHeart}
                                />

                                <Link href={`/travel/${item.tour.tourname.replace(/\s+/g, '-')}-${item.tour.tourid}`}>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <div className="relative">
                                            <img
                                                className="w-full h-[250px] rounded-lg transition-all duration-500 relative group-hover:z-10 group-hover:-translate-y-5"
                                                src={item.tour.tourpath}
                                            />
                                            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:z-20 group-hover:-translate-y-5 transition-all duration-500 rounded-lg">
                                                <div className="text-white text-[24px] font-bold uppercase">
                                                    {item.tour.nation}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative -top-16 w-[95%] ml-[2.5%] mr-[2.5%] h-[200px] bg-white shadow-lg py-3 rounded-lg !z-0">
                                            <div className="text-[18px] uppercase text-center font-bold bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent border-x-4 border-solid border-[#0B8494]">
                                                {item.tour.tourname}
                                            </div>
                                            <div className="py-2 px-4 text-left">
                                                {item.tour.descrip}
                                            </div>
                                            <div className="mt-10">
                                                <div className="w-full absolute bottom-5 flex justify-center items-center">
                                                    <div className="w-[50%] border-r-[.5px] border-solid border-[#ccc] text-center">
                                                        <FontAwesomeIcon className="mr-2 text-[#0B8494]" icon={faLocationDot} />
                                                        {item.tour.nation}
                                                    </div>
                                                    <div className="w-[50%] border-l-[.5px] border-solid border-[#ccc] text-center">
                                                        <FontAwesomeIcon className="mr-2 text-[#0B8494]" icon={faTag} />
                                                        {item.tour.totaldate} days
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center m-[10px_0] p-[10px_0]">
                    {pageHistories.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentH(number)}
                            className={`mx-1 ${number === currentH ? 'bg-[#000000] text-[#fff] rounded-[50%] font-bold w-[40px] h-[40px] p-[5px]' : 'bg-[#eee] text-[#374151] rounded-[50%] w-[40px] h-[40px] p-[5px] '} hover:bg-[#89bde7] hover:text-[#000]`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    )
}

export { Search }