'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faHeart, faLocationDot, faPlus, faTag, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { BsHexagonFill } from "react-icons/bs";
import AOS from "aos";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const Title = () => {
    const [region, setRegion] = useState<any>([]);
    const [regionId, setRegionId] = useState<number>(0);
    const [tourid, setTourid] = useState<number>(0);
    const [destination, setDestination] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeRegionId, setActiveRegionId] = useState<number>(0);
    const [createForm, setCreateForm] = useState<boolean>(false);
    const [showList, setShowList] = useState<boolean>(false);
    const [wishlistTours, setWishlistTours] = useState<number[]>([]);
    const [group, setGroup] = useState<any>([]);
    const [userId, setUserId] = useState<any>('');
    const [latestWishlistIds, setLatestWishlistIds] = useState<any>([]);
    const [quantity, setQuantity] = useState<any>([]);
    const [name, setName] = useState<string>('');
    const [fetchDataTrigger, setFetchDataTrigger] = useState(false);
    const itemsPerPage: number = 4;
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = destination.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(destination.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userid = sessionStorage.getItem('user');
            setUserId(userid);
        }
    }, [userId]);

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
            }).catch(err => {
                console.log('Error fetch data');
            })
    }, []);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/getDestination`, {
            id: regionId
        }).then(res => {
            setDestination(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [regionId]);

    const handleFilter = (id: number) => {
        setRegionId(id);
        setActiveRegionId(id);
    }

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

    return (
        <div>
            <div className="mt-10 flex">
                <div onClick={() => handleFilter(0)} className={`flex justify-center items-center w-[180px] h-[50px] py-2 px-4 mr-2 rounded-md border border-solid cursor-pointer hover:border-[#3c3c3c] ${activeRegionId === 0 ? 'bg-[#0B8494] text-white' : 'border-[#ccc]'
                    }`}>
                    <FontAwesomeIcon className="mr-[6px]" icon={faGlobe} />
                    All Destination
                </div>
                {region.map((item: any) => (
                    <div onClick={() => handleFilter(item.regionid)} key={item.regionid} className={`flex justify-center items-center w-[100px] h-[50px] py-2 px-4 mx-2 rounded-md border border-solid cursor-pointer hover:border-[#3c3c3c] ${activeRegionId === item.regionid ? 'bg-[#0B8494] text-white' : 'border-[#ccc]'
                        }`}>
                        {item.regionname}
                    </div>
                ))}
            </div>
            <div className="mt-10">
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
                <div className="flex justify-center mt-6 m-[20px_0] p-[10px_0]">
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

        </div>
    )
}

const MostDestination = () => {
    const [visibleIndices, setVisibleIndices] = useState<any>([]);
    const [timelineVisible, setTimelineVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('Korea');
    const [oneMost, setOneMost] = useState<any>([]);

    const timelineAnimationStyle = {
        animation: 'slideIn 1s forwards',
    };

    const handleClick = (name: string) => {
        setName(name);
    };

    const local = [
        {
            name: 'Korea',
            land: 'Land of kimchi',
            img: '/assets/images/destination/korea.jpg'
        },
        {
            name: 'Japan',
            land: 'Land of the rising sun',
            img: '/assets/images/destination/japan.jpg'
        },
        {
            name: 'Indonesia',
            land: 'Land of thousands of islands',
            img: '/assets/images/destination/indonesia.jpg'
        },
        {
            name: 'Australia',
            land: 'Land of kangaroos',
            img: '/assets/images/destination/australia.jpg'
        }
    ];

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/attraction/getMostAttractive`, {
            name
        }).then(res => {
            setOneMost(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [name])

    useEffect(() => {
        setTimelineVisible(true);
        const timelineTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setVisibleIndices((prev: any) => {

                    if (prev.length >= oneMost.length) {
                        clearInterval(interval);
                        return prev;
                    }

                    return [...prev, prev.length];
                });
            }, 500);

            return () => clearInterval(interval);
        }, 500);

        return () => clearTimeout(timelineTimeout);
    }, [oneMost]);

    return (
        <div className='mt-10'>
            <div>
                <div className="grid grid-cols-4 gap-4">
                    {local.map((item: any) => (
                        <div key={item.name} className=" flex justify-center items-center cursor-pointer">
                            <div onClick={() => handleClick(item.name)} className={`w-fit flex px-5 py-4 rounded-lg cursor-pointer p-2 transition-all duration-500 ${name === item.name ? 'bg-[#0B8494]' : 'bg-transparent'}`}>
                                <img className={`w-[60px] h-[60px] rounded-[50%] mr-2 ${name === item.name ? 'border-2 border-solid border-white' : 'border-none'}`} src={item.img} />
                                <div className="pt-1">
                                    <p className={`text-[20px] font-semibold uppercase font-serif mb-0 ${name === item.name ? 'text-white' : 'text-[#0B8494]'}`}>{item.name}</p>
                                    <p className={`text-[14px] italic ${name === item.name ? 'text-white' : 'text-black'}`}>{item.land}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center my-80 relative">
                <div
                    className={`bg-[#0B8494] h-[1px] w-full flex flex-row justify-around items-center relative ${timelineVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                    style={timelineAnimationStyle}
                >
                    {oneMost.map((item: any, index: number) => (
                        <div key={item.attractionid} className="relative flex flex-col items-center">
                            <div className={`transition-opacity duration-500 ${visibleIndices.includes(index) ? 'opacity-100' : 'opacity-0'}`}>
                                <BsHexagonFill className="text-[30px] rotate-[90deg] text-[#2fa8b9]" />
                                <p className={`absolute left-[-80px] w-[200px] font-serif font-medium text-center transition-opacity duration-500 ${visibleIndices.includes(index) ? 'opacity-100' : 'opacity-0'} ${index % 2 === 0 ? 'top-[50px]' : 'bottom-[50px]'}`}>
                                    {item.attractiondescript}
                                </p>
                                <p className={`absolute left-[-80px] w-[200px] text-[20px] font-extrabold bg-gradient-to-tr from-white via-[#0B8494] to-[#001E23] bg-clip-text text-transparent text-center transition-opacity duration-500  ${visibleIndices.includes(index) ? 'opacity-100' : 'opacity-0'} ${index % 2 !== 0 ? 'top-[210px]' : 'bottom-[210px]'}`}>
                                    {item.attractioname}
                                </p>
                                <div className={`absolute left-[-80px] w-[200px] transition-opacity duration-500 ${visibleIndices.includes(index) ? 'opacity-100' : 'opacity-0'} ${index % 2 !== 0 ? 'top-[50px]' : 'bottom-[50px]'}`}>
                                    <img className="w-full h-[150px] rounded-lg" src={item.attractionpath} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { Title, MostDestination };