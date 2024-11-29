'use client';
import React, { useEffect, useState } from "react";
import Information from "../layout/info";
import Swal from "sweetalert2";
import { checkAuth } from "@/app/auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaby, faCalendarAlt, faChild, faLocationDot, faPlus, faQrcode, faUserTie } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { toast } from "sonner";
import { format } from "date-fns";

const ManageSchedule = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [tour, setTour] = useState<any>([]);
    const [chooseTour, setChooseTour] = useState<any>([]);
    const [tourPrices, setTourPrices] = useState<any>([]);
    const [keyword, setKeyword] = useState<any>('');
    const [schedule, setSchedule] = useState<{ [key: number]: any }>({});
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [beforeChoose, setBeforeChoose] = useState<boolean>(true);
    const [selectedTour, setSelectedTour] = useState<any>('');
    const [editId, setEditId] = useState<any>('');
    const [afterChoose, setAfterChoose] = useState<boolean>(false);
    const [oneTour, setOneTour] = useState<any>([]);
    const [editTour, setEditTour] = useState<any>([]);
    const [editSchedule, setEditSchedule] = useState<any>([]);
    const [tourData, setTourData] = useState<TourDay[]>([]);
    const [editData, setEditData] = useState<TourDay[]>([]);
    const itemsPerSlide = 4;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = currentPage === 1 ? 0 : indexOfLastItem - itemsPerPage;
    const currentTours = currentPage === 1
        ? tour.slice(indexOfFirstItem, indexOfFirstItem + 2)
        : tour.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tour.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCloseCreateOpen = () => setCreateOpen(false);

    const groupedTours: any = [];
    for (let i = 0; i < chooseTour.length; i += itemsPerSlide) {
        groupedTours.push(chooseTour.slice(i, i + itemsPerSlide));
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const admin = sessionStorage.getItem('admin');
            setAdminid(admin);
        }
    }, [adminid]);

    useEffect(() => {
        console.log(keyword);
        if (keyword) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findByTourCode`, {
                keyword
            }).then(res => {
                setTour(res.data);
                setChooseTour(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findAllTour`)
                .then(res => {
                    setTour(res.data);
                    setChooseTour(res.data);
                    const tourData = res.data;
                    console.log(res.data);

                    const tourIds = tourData.map((tour: any) => tour.tourid);
                    fetchSchedules(tourIds);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }
    }, [keyword]);

    const fetchSchedules = async (tourIds: number[]) => {
        const scheduleData: { [key: number]: any } = {};

        await Promise.all(tourIds.map(async (tourid: any) => {
            try {
                const res = await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/getScheduleByTourId`, {
                    id: tourid
                });
                scheduleData[tourid] = res.data;
                console.log(scheduleData);
            } catch (err) {
                console.log(`Error fetching schedule for tour ${tourid}: ` + err);
            }
        }));

        setSchedule(scheduleData);
    };

    const fetchData = () => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findAllTour`)
            .then(res => {
                setTour(res.data);
                setChooseTour(res.data);
                const tourData = res.data;
                console.log(res.data);

                const tourIds = tourData.map((tour: any) => tour.tourid);
                fetchSchedules(tourIds);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            if (!checkAuth()) {
                const result = await Swal.fire({
                    title: 'Vui lòng đăng nhập',
                    text: 'Bạn cần đăng nhập để tiếp tục sử dụng dịch vụ',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f8b602'
                });
                if (result.isConfirmed) {
                    window.location.href = '/';
                }

            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuthentication();
    }, []);

    const fetchTourPrice = async (tourid: any) => {
        try {
            const response = await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tourprice/findPriceByTourId`, { tourid: tourid });
            console.log(response.data);
            setTourPrices((prevPrices: any) => ({
                ...prevPrices,
                [tourid]: response.data,
            }));
        } catch (error) {
            console.error('Lỗi khi lấy giá tour:', error);
        }
    };

    const handleChooseTour = async (tourid: number) => {
        setBeforeChoose(false);
        setSelectedTour(tourid);
        await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findTourByTourId`, {
            tourid
        }).then(res => {
            setAfterChoose(true);
            setOneTour(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }

    useEffect(() => {
        tour.forEach((item: any) => fetchTourPrice(item.tourid));
    }, [tour]);

    const handleUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'tmz6fhxc');
        const resourceType = 'image';
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/dlj9sdjb6/${resourceType}/upload`, formData);
            console.log('Upload thành công: ' + response.data);
            return response.data.secure_url;
        } catch (error) {
            console.log('Upload thất bại: ' + error);
        }
    }


    interface TourSession {
        image?: File | null;
        name?: string;
        description?: string;
    }

    interface TourDay {
        [session: string]: TourSession;
    }

    const handleChange = async (
        dayIndex: number,
        session: 'Buổi sáng' | 'Buổi chiều' | 'Buổi tối',
        field: 'image' | 'name' | 'description',
        value: File | string | null
    ) => {
        if (field === 'image' && value instanceof File) {
            try {
                const imageUrl = await handleUpload(value);
                if (imageUrl) {
                    const updatedTourData = [...tourData];
                    if (!updatedTourData[dayIndex]) {
                        updatedTourData[dayIndex] = {};
                    }
                    updatedTourData[dayIndex][session] = {
                        ...updatedTourData[dayIndex][session],
                        [field]: imageUrl,
                    };
                    setTourData(updatedTourData);
                } else {
                    console.log('Không thể tải hình ảnh lên Cloudinary');
                }
            } catch (error) {
                console.log('Lỗi khi upload hình ảnh:', error);
            }
        } else {
            const updatedTourData = [...tourData];
            if (!updatedTourData[dayIndex]) {
                updatedTourData[dayIndex] = {};
            }
            updatedTourData[dayIndex][session] = {
                ...updatedTourData[dayIndex][session],
                [field]: value,
            };
            setTourData(updatedTourData);
        }
    };

    const handleEditChange = async (
        dayIndex: number,
        session: 'Buổi sáng' | 'Buổi chiều' | 'Buổi tối',
        field: 'image' | 'name' | 'description',
        value: File | string | null
    ) => {
        const updatedTourData = [...editData];

        if (field === 'image' && value instanceof File) {
            try {
                const imageUrl = await handleUpload(value);
                if (imageUrl) {
                    if (!updatedTourData[dayIndex]) {
                        updatedTourData[dayIndex] = {};
                    }
                    updatedTourData[dayIndex][session] = {
                        ...updatedTourData[dayIndex][session],
                        [field]: imageUrl,
                    };
                    setEditData(updatedTourData);
                } else {
                    console.log('Không thể tải hình ảnh lên Cloudinary');
                }
            } catch (error) {
                console.log('Lỗi khi upload hình ảnh:', error);
            }
        } else {
            if (!updatedTourData[dayIndex]) {
                updatedTourData[dayIndex] = {};
            }

            updatedTourData[dayIndex][session] = {
                ...updatedTourData[dayIndex][session],
                [field]: value,
            };

            setEditData(updatedTourData);
        }
    };

    const handleEdit = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        const scheduleData = {
            tourid: editId,
            schedules: editData.map((day, dayIndex) => ({
                daynumber: dayIndex + 1,
                morplan: day['mor']?.name,
                mordes: day['mor']?.description,
                morimg: day['mor']?.image,
                afterplan: day['after']?.name,
                afterdes: day['after']?.description,
                afterimg: day['after']?.image,
                evenplan: day['even']?.name,
                evendes: day['even']?.description,
                evenimg: day['even']?.image,
            })),
        };

        await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/update`, scheduleData)
            .then(res => {
                if (res.data.success) {
                    toast.success(`Sửa lịch trình thành công`, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });

                    fetchData();
                    setEditOpen(false);
                    console.log(res.data);
                } else {
                    toast.error(`Sửa lịch trình thất bại 1`, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                }
            }).catch(err => {
                console.log('Error fetch data: ' + err);
                toast.error(`Sửa lịch trình thất bại`, {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                setEditOpen(false);
            })

    }

    const handleCreate = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let isValid = true;
        const updatedTourData = tourData;
        updatedTourData.forEach((day, dayIndex) => {
            ["Buổi sáng", "Buổi chiều", "Buổi tối"].forEach((session) => {
                const sessionData = day[session];
                if (!sessionData || !sessionData.name || !sessionData.description || !sessionData.image) {
                    isValid = false;
                    toast.success(`Vui lòng điền đầy đủ thông tin cho ngày ${dayIndex + 1} - ${session}`, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                }
            });
        });

        if (isValid) {
            const scheduleData = {
                tourid: selectedTour,
                schedules: tourData.map((day, dayIndex) => ({
                    daynumber: dayIndex + 1,
                    morplan: day['Buổi sáng']?.name,
                    mordes: day['Buổi sáng']?.description,
                    morimg: day['Buổi sáng']?.image,
                    afterplan: day['Buổi chiều']?.name,
                    afterdes: day['Buổi chiều']?.description,
                    afterimg: day['Buổi chiều']?.image,
                    evenplan: day['Buổi tối']?.name,
                    evendes: day['Buổi tối']?.description,
                    evenimg: day['Buổi tối']?.image,
                })),
            };

            await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/create`, scheduleData)
                .then(res => {
                    if (res.data.success) {
                        toast.success(`Thêm lịch trình mới thành công`, {
                            description: formattedDate,
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        });

                        fetchData();
                        setCreateOpen(false);
                        console.log(res.data);
                    } else {
                        toast.error(`Thêm lịch trình mới thất bại`, {
                            description: formattedDate,
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        });
                    }
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                    toast.error(`Thêm lịch trình mới thất bại`, {
                        description: err,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setCreateOpen(false);
                })
        }
    }

    const handleGetTour = async (tourid: number) => {
        setEditOpen(true);
        setEditId(tourid)
        await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findTourByTourId`, {
            tourid
        }).then(res => {
            setEditTour(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        });

        await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/findByTourIds`, {
            tourid
        }).then(res => {
            setEditSchedule(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }

    useEffect(() => {
        if (editSchedule.length > 0) {
            setEditData(editSchedule.map((schedule: any) => ({
                daynumber: schedule.daynumber,
                mor: {
                    name: schedule.morplan,
                    description: schedule.mordes,
                    image: schedule.morimg,
                },
                after: {
                    name: schedule.afterplan,
                    description: schedule.afterdes,
                    image: schedule.afterimg,
                },
                even: {
                    name: schedule.evenplan,
                    description: schedule.evendes,
                    image: schedule.evenimg,
                },
            })));
        }
    }, [editSchedule]);

    const handleDelete = () => {
        Swal.fire({
            title: 'Bạn chắc chắn chứ?',
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa lịch trình!',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/schedule/delete`, {
                    tourid: editId
                }).then(res => {
                    const currentDate = new Date();
                    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                    fetchData();
                    const successMessage = 'Deleted Schedule successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    fetchData();
                    setEditOpen(false);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
            } else {
                Swal.fire({
                    title: 'Đã hủy',
                    text: 'Bạn đã hủy việc xóa chuyến đi!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
    }

    return (
        <div className={isAuthenticated ? '' : 'blurred-content'}>
            <div className="mx-10">
                <div className="flex items-center justify-between">
                    <p className="text-[1.2rem] font-sans font-semibold">Lịch trình của chuyến đi</p>
                    <div className="w-[35%] flex items-center justify-around">
                        <input
                            type="text"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Nhập mã chuyến đi..."
                            className="w-[75%] mr-3 py-1 px-3 border-[1px] border-solid border-[#ccc] focus:outline-none rounded-md" />
                        <Information />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-5 mt-8">
                    {currentPage === 1 && (
                        <div
                            onClick={handleCreateOpen}
                            className="w-full h-[300px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                            <div className="w-[calc(100%-10%)] mt-5 mx-[5%] h-[250px] bg-[#ccc] rounded-lg">
                                <div className="flex items-center justify-center">
                                    <FontAwesomeIcon className="text-[50px] relative top-20 text-white" icon={faPlus} />
                                </div>
                                <p className="mt-32 text-[20px] font-semibold text-center text-white">Lịch trình mới</p>
                            </div>
                        </div>
                    )}
                    {currentTours.map((item: any) => (
                        <div
                            onClick={() => handleGetTour(item.tourid)}
                            key={item.tourid}
                            className="w-full h-[350px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer relative z-50">
                            <div className="flex">
                                <div className="w-[20%]">
                                    <img loading="lazy" src={item.tourpath} alt="Tour Image" className="w-full h-[349px] object-cover object-center rounded-s-lg" />
                                </div>
                                <div className="w-[20%]">
                                    <p className="mt-2 mx-[5%] text-[1.125rem] font-medium">{item.tourname}</p>
                                    <p className="mx-[5%] italic font-semibold text-[.7rem] mb-3"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{item.tourcode}</p>
                                    <p className="text-[.75rem] mx-[5%]">{item.descrip}</p>
                                    <div>
                                        <div className="mt-5 mx-[5%] space-x-1 flex items-center justify-center text-center">
                                            {tourPrices[item.tourid] ? (
                                                tourPrices[item.tourid].map((priceInfo: any) => (
                                                    <div key={priceInfo.tourpriceid} className="text-[.75rem]">
                                                        <div className="w-fit">
                                                            <div className="flex py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md">
                                                                <p>
                                                                    <FontAwesomeIcon className="mr-1" icon={priceInfo.age.agegroup === 'adult' ? faUserTie : priceInfo.age.agegroup === 'children' ? faChild : faBaby} />
                                                                    {priceInfo.age.agegroup} ${priceInfo.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[.75rem]">Loading tour prices...</p>
                                            )}
                                        </div>
                                        <div className="mx-3 mt-5">
                                            <div className="w-fit py-1 px-3 rounded-lg bg-yellow-500">
                                                <FontAwesomeIcon className="mr-2 text-white" icon={faCalendarAlt} />
                                                <span className="text-[.8rem] text-white">{item.totaldate} Ngày {item.totaldate - 1} Đêm</span>
                                            </div>
                                            <div className="mt-5">
                                                <FontAwesomeIcon className="mr-2 text-blue-500" icon={faLocationDot} />
                                                <span className="text-[.8rem]">{item.nation}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[60%]">
                                    <div className={`grid grid-cols-1 gap-5 mx-12`}>
                                        <div className="w-full">
                                            {schedule[item.tourid] && schedule[item.tourid]?.length ? (
                                                <Carousel className="w-full">
                                                    <CarouselContent className="-ml-1">
                                                        {schedule[item.tourid].slice(0, schedule[item.tourid]?.length).map((daySchedule: any, index: number) => (
                                                            <CarouselItem key={index} className="p-4">
                                                                <div className="text-center font-bold text-lg mb-4">
                                                                    Ngày {daySchedule.daynumber}
                                                                </div>

                                                                <div className="grid grid-cols-3 gap-5">
                                                                    <div className="w-full h-[265px] border-[1px] border-solid border-[#ccc] rounded-lg p-4">
                                                                        <img loading="lazy" src={daySchedule.morimg} alt="Sáng" className="w-full h-[100px] mb-2 !rounded-md" />
                                                                        <p>
                                                                            <strong>Sáng:</strong>
                                                                            <p>{daySchedule.morplan} - {daySchedule.mordes}</p>
                                                                        </p>
                                                                    </div>

                                                                    <div className="w-full h-[265px] border-[1px] border-solid border-[#ccc] rounded-lg p-4">
                                                                        <img loading="lazy" src={daySchedule.afterimg} alt="Chiều" className="w-full h-[100px] mb-2 !rounded-md" />
                                                                        <p>
                                                                            <strong>Chiều:</strong>
                                                                            <p>{daySchedule.afterplan} - {daySchedule.afterdes}</p>
                                                                        </p>
                                                                    </div>

                                                                    <div className="w-full h-[265px] border-[1px] border-solid border-[#ccc] rounded-lg p-4">
                                                                        <img loading="lazy" src={daySchedule.evenimg} alt="Tối" className="w-full h-[100px] mb-2 !rounded-md" />
                                                                        <p>
                                                                            <strong>Tối:</strong>
                                                                            <p>{daySchedule.evenplan} - {daySchedule.evendes}</p>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious>
                                                        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Prev</button>
                                                    </CarouselPrevious>
                                                    <CarouselNext>
                                                        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Next</button>
                                                    </CarouselNext>
                                                </Carousel>
                                            ) : (
                                                <p className="mt-40 text-center">No schedule available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {createOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer overflow-y-auto" onClick={handleCloseCreateOpen}>
                                    <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                                        <h2 className="text-xl text-center font-semibold my-4">Thêm lịch trình mới</h2>
                                        <div className="grid grid-cols-1 gap-5">
                                            {beforeChoose && (
                                                <Carousel className="w-full">
                                                    <CarouselContent>
                                                        {groupedTours.map((group: any, groupIndex: number) => (
                                                            <CarouselItem key={groupIndex} className="flex space-x-4">
                                                                {group.map((item: any, index: number) => (
                                                                    <div
                                                                        onClick={(e) => handleChooseTour(item.tourid)}
                                                                        key={item.tourid}
                                                                        className="w-1/4 h-[380px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer relative">
                                                                        <img loading="lazy" src={item.tourpath} alt="Tour Image" className="w-full h-[150px] object-cover object-center rounded-t-lg" />
                                                                        <p className="mt-2 mx-[5%] text-[1.125rem] text-center font-medium">{item.tourname}</p>
                                                                        <p className="mx-[5%] italic font-semibold text-[.7rem] text-center mb-3"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{item.tourcode}</p>
                                                                        <p className="text-[.75rem] mx-[5%]">{item.descrip}</p>
                                                                        <div>
                                                                            <div className="mt-5 mx-[5%] space-x-1 flex items-center justify-center text-center">
                                                                                {tourPrices[item.tourid] ? (
                                                                                    tourPrices[item.tourid].map((priceInfo: any) => (
                                                                                        <div key={priceInfo.tourpriceid} className="text-[.75rem]">
                                                                                            <div className="w-fit">
                                                                                                <div className="flex py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md">
                                                                                                    <p>
                                                                                                        <FontAwesomeIcon className="mr-1" icon={priceInfo.age.agegroup === 'adult' ? faUserTie : priceInfo.age.agegroup === 'children' ? faChild : faBaby} />
                                                                                                        {priceInfo.age.agegroup} ${priceInfo.price}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                ) : (
                                                                                    <p className="text-[.75rem]">Loading tour prices...</p>
                                                                                )}
                                                                            </div>
                                                                            <div className="mx-3 mt-5">
                                                                                <div className="w-fit absolute top-5 right-0 py-1 px-3 rounded-s-lg bg-yellow-500">
                                                                                    <FontAwesomeIcon className="mr-2 text-white" icon={faCalendarAlt} />
                                                                                    <span className="text-[.8rem] text-white">{item.totaldate} Ngày {item.totaldate - 1} Đêm</span>
                                                                                </div>
                                                                                <div className="mt-5 text-right">
                                                                                    <span className="text-[.8rem] mr-2">{item.nation}</span>
                                                                                    <FontAwesomeIcon className="text-blue-500" icon={faLocationDot} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious>
                                                        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Prev</button>
                                                    </CarouselPrevious>
                                                    <CarouselNext>
                                                        <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Next</button>
                                                    </CarouselNext>
                                                </Carousel>
                                            )}
                                            {afterChoose && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer overflow-y-auto" onClick={handleCloseCreateOpen}>
                                                    <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                                                        <div className="w-full h-[600px] grid grid-cols-1">
                                                            {oneTour && (
                                                                <div className="relative overflow-y-auto">
                                                                    <div className="w-full h-[400px] flex border-[1px] border-solid border-[#ccc] rounded-md relative">
                                                                        <div className="w-[20%]">
                                                                            <img className="w-full h-[399px] rounded-s-md" src={oneTour.tourpath} />
                                                                        </div>
                                                                        <div className="w-[20%] ml-[1%] mt-3">
                                                                            <p className="text-[1.5rem] font-semibold">{oneTour.tourname}</p>
                                                                            <p className="italic font-semibold text-[.7rem] mb-3"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{item.tourcode}</p>
                                                                            <p className="text-[.75rem] my-3">{item.descrip}</p>
                                                                            <div className="space-y-2">
                                                                                {tourPrices[oneTour.tourid] ? (
                                                                                    tourPrices[oneTour.tourid].map((priceInfo: any) => (
                                                                                        <div key={priceInfo.tourpriceid} className="text-[.75rem]">
                                                                                            <div className="w-fit">
                                                                                                <div className="flex py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md">
                                                                                                    <p>
                                                                                                        <FontAwesomeIcon className="mr-1" icon={priceInfo.age.agegroup === 'adult' ? faUserTie : priceInfo.age.agegroup === 'children' ? faChild : faBaby} />
                                                                                                        {priceInfo.age.agegroup} ${priceInfo.price}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                ) : (
                                                                                    <p className="text-[.75rem]">Loading tour prices...</p>
                                                                                )}
                                                                            </div>
                                                                            <div className="mt-5 text-left">
                                                                                <FontAwesomeIcon className="text-blue-500 mr-2" icon={faLocationDot} />
                                                                                <span className="text-[.8rem]">{item.nation}</span>
                                                                            </div>
                                                                            <div className="w-fit absolute top-5 left-0 py-1 px-3 rounded-r-lg bg-yellow-500">
                                                                                <FontAwesomeIcon className="mr-2 text-white" icon={faCalendarAlt} />
                                                                                <span className="text-[.8rem] text-white">{item.totaldate} Ngày {item.totaldate - 1} Đêm</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="w-[60%] mx-5">
                                                                            <Carousel className="w-[calc(100%-10%)]">
                                                                                <CarouselContent>
                                                                                    {tourData.map((dayData: any, dayIndex: any) => (
                                                                                        <CarouselItem key={dayIndex} className="flex space-x-4">
                                                                                            <div className="w-full">
                                                                                                <p className="text-[1.25rem] text-center my-2 font-semibold">Ngày {dayIndex + 1}</p>
                                                                                                <div className="grid grid-cols-3 gap-5">
                                                                                                    {["Buổi sáng", "Buổi chiều", "Buổi tối"].map((session, sessionIndex) => (
                                                                                                        <div key={sessionIndex} className="w-full">
                                                                                                            <p className="text-[1.25rem] my-3 font-medium">{session}</p>

                                                                                                            {dayData[session] && (
                                                                                                                <div className="w-full h-[250px] border-[1px] border-solid border-[#ccc] rounded-md">
                                                                                                                    <img
                                                                                                                        src={dayData[session].image || ''}
                                                                                                                        alt={`Image for ${session}`}
                                                                                                                        className="w-full h-[100px] rounded-t-md"
                                                                                                                        loading="lazy"
                                                                                                                    />
                                                                                                                    <p className="text-center mx-3 font-medium">{dayData[session].name}</p>
                                                                                                                    <p className="text-[.75rem] mx-3 text-center break-words whitespace-normal">{dayData[session].description}</p>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        </CarouselItem>
                                                                                    ))}
                                                                                </CarouselContent>

                                                                                {tourData.length > 0 ? (
                                                                                    <div>
                                                                                        <CarouselPrevious>
                                                                                            <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Prev</button>
                                                                                        </CarouselPrevious>

                                                                                        <CarouselNext>
                                                                                            <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Next</button>
                                                                                        </CarouselNext>
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="mt-20 text-center">No Data Available</p>
                                                                                )}
                                                                            </Carousel>
                                                                        </div>
                                                                    </div>
                                                                    {Array.from({ length: oneTour.totaldate }).map((_, dayIndex) => (
                                                                        <div key={dayIndex}>
                                                                            <p className="mt-5">Ngày {dayIndex + 1}</p>
                                                                            <div className="grid grid-cols-3 gap-5">
                                                                                {["Buổi sáng", "Buổi chiều", "Buổi tối"].map((session: any, sessionIndex: any) => (
                                                                                    <div key={sessionIndex} className="w-full">
                                                                                        <p className="text-[1.25rem] my-3 font-semibold">{session}</p>
                                                                                        <label>Hình ảnh {session.toLowerCase()}</label>
                                                                                        <input
                                                                                            type="file"
                                                                                            onChange={(e) => handleChange(dayIndex, session, 'image', e.target.files ? e.target.files[0] : '')}
                                                                                            accept="image/*"
                                                                                            className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                                                        />

                                                                                        <div className="mt-3">
                                                                                            <label>Tên địa điểm</label>
                                                                                            <input
                                                                                                type="text"
                                                                                                onChange={(e) => handleChange(dayIndex, session, 'name', e.target.value)}
                                                                                                placeholder="Nhập tên địa điểm..."
                                                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                                                            />
                                                                                        </div>

                                                                                        <div className="mt-3">
                                                                                            <label>Mô tả</label>
                                                                                            <input
                                                                                                type="text"
                                                                                                onChange={(e) => handleChange(dayIndex, session, 'description', e.target.value)}
                                                                                                placeholder="Nhập mô tả..."
                                                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="grid grid-cols-4 gap-10 mt-8">
                                                                        <div></div>
                                                                        <div
                                                                            onClick={() => setCreateOpen(false)}
                                                                            className="text-center py-2 px-3 bg-[#6B7280] text-white rounded-md">
                                                                            Hủy bỏ
                                                                        </div>
                                                                        <div
                                                                            onClick={handleCreate}
                                                                            className="text-center py-2 px-3 bg-blue-500 text-white rounded-md">
                                                                            Thêm lịch trình mới
                                                                        </div>
                                                                        <div></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center my-5 space-x-2">
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
                {editOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer overflow-y-auto" onClick={() => setEditOpen(false)}>
                        <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl text-center font-semibold my-4">Sửa lịch trình <span className="text-red-600">{editTour.tourname}</span></h2>
                            <div className="w-full h-[600px] grid grid-cols-1">
                                <div className="w-full h-[400px] flex border-[1px] border-solid border-[#ccc] rounded-md relative">
                                    <div className="w-[20%]">
                                        <img className="w-full h-[399px] rounded-s-md" src={editTour.tourpath} />
                                    </div>
                                    <div className="w-[20%] ml-[1%] mt-3">
                                        <p className="text-[1.5rem] font-semibold">{editTour.tourname}</p>
                                        <p className="italic font-semibold text-[.7rem] mb-3"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{editTour.tourcode}</p>
                                        <p className="text-[.75rem] my-3">{editTour.descrip}</p>
                                        <div className="space-y-2">
                                            {tourPrices[editTour.tourid] ? (
                                                tourPrices[editTour.tourid].map((priceInfo: any) => (
                                                    <div key={priceInfo.tourpriceid} className="text-[.75rem]">
                                                        <div className="w-fit">
                                                            <div className="flex py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md">
                                                                <p>
                                                                    <FontAwesomeIcon className="mr-1" icon={priceInfo.age.agegroup === 'adult' ? faUserTie : priceInfo.age.agegroup === 'children' ? faChild : faBaby} />
                                                                    {priceInfo.age.agegroup} ${priceInfo.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[.75rem]">Loading tour prices...</p>
                                            )}
                                        </div>
                                        <div className="mt-5 text-left">
                                            <FontAwesomeIcon className="text-blue-500 mr-2" icon={faLocationDot} />
                                            <span className="text-[.8rem]">{editTour.nation}</span>
                                        </div>
                                        <div className="w-fit absolute top-5 left-0 py-1 px-3 rounded-r-lg bg-yellow-500">
                                            <FontAwesomeIcon className="mr-2 text-white" icon={faCalendarAlt} />
                                            <span className="text-[.8rem] text-white">{editTour.totaldate} Ngày {editTour.totaldate - 1} Đêm</span>
                                        </div>
                                    </div>
                                    <div className="w-[60%]">
                                        <div className={`grid grid-cols-1 gap-5 mx-12`}>
                                            <div className="w-full">
                                                {editSchedule && editSchedule?.length ? (
                                                    <Carousel className="w-full">
                                                        <CarouselContent className="-ml-1">
                                                            {editSchedule.length > 0 && editSchedule.map((schedule: any, index: number) => (
                                                                <CarouselItem key={index} className="p-4">
                                                                    <div className="text-center font-bold text-lg mb-4">
                                                                        Ngày {schedule.daynumber}
                                                                    </div>

                                                                    <div className="grid grid-cols-3 gap-5">
                                                                        <div className="w-full h-[265px] border-[1px] border-solid border-[#ccc] rounded-lg p-4">
                                                                            <img loading="lazy" src={schedule.morimg} alt="Sáng" className="w-full h-[100px] mb-2 !rounded-md" />
                                                                            <p>
                                                                                <strong>Sáng:</strong>
                                                                                <p>{schedule.morplan} - {schedule.mordes}</p>
                                                                            </p>
                                                                        </div>

                                                                        <div className="w-full h-[265px] border-[1px] border-solid border-[#ccc] rounded-lg p-4">
                                                                            <img loading="lazy" src={schedule.afterimg} alt="Chiều" className="w-full h-[100px] mb-2 !rounded-md" />
                                                                            <p>
                                                                                <strong>Chiều:</strong>
                                                                                <p>{schedule.afterplan} - {schedule.afterdes}</p>
                                                                            </p>
                                                                        </div>

                                                                        <div className="w-full h-[265px] border-[1px] border-solid border-[#ccc] rounded-lg p-4">
                                                                            <img loading="lazy" src={schedule.evenimg} alt="Tối" className="w-full h-[100px] mb-2 !rounded-md" />
                                                                            <p>
                                                                                <strong>Tối:</strong>
                                                                                <p>{schedule.evenplan} - {schedule.evendes}</p>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </CarouselItem>
                                                            ))}
                                                        </CarouselContent>
                                                        <CarouselPrevious>
                                                            <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Prev</button>
                                                        </CarouselPrevious>
                                                        <CarouselNext>
                                                            <button className="px-4 py-2 text-white bg-blue-500 rounded-md">Next</button>
                                                        </CarouselNext>
                                                    </Carousel>
                                                ) : (
                                                    <p className="mt-40 text-center">No schedule available</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {editSchedule.length > 0 && editSchedule.map((schedule: any, index: number) => (
                                    <div key={index}>
                                        <p className="mt-5">Ngày {schedule.daynumber}</p>
                                        <div className="grid grid-cols-3 gap-5">
                                            {["mor", "after", "even"].map((session: any, sessionIndex: any) => {
                                                const sessionLower = session.toLowerCase();
                                                return (
                                                    <div key={sessionIndex} className="w-full">
                                                        <p className="text-[1.25rem] my-3 font-semibold">{session === 'mor' ? 'Buổi sáng' : session === 'after' ? 'Buổi chiều' : 'Buổi tối'}</p>
                                                        <div>
                                                            <label>Hình ảnh {session === 'mor' ? 'buổi sáng' : session === 'after' ? 'buổi chiều' : 'buổi tối'}</label>
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleEditChange(index, sessionLower, 'image', e.target.files ? e.target.files[0] : '')}
                                                                accept="image/*"
                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            />
                                                        </div>

                                                        <div className="mt-3">
                                                            <label>Tên địa điểm</label>
                                                            <input
                                                                type="text"
                                                                value={editData[index]?.[session]?.name || ''}
                                                                onChange={(e) => handleEditChange(index, sessionLower, 'name', e.target.value)}
                                                                placeholder={`Nhập mô tả ${session === 'mor' ? 'buổi sáng' : session === 'after' ? 'buổi chiều' : 'buổi tối'}...`}
                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            />
                                                        </div>

                                                        <div className="mt-3">
                                                            <label>Mô tả</label>
                                                            <input
                                                                type="text"
                                                                value={editData[index]?.[session]?.description || ''}
                                                                onChange={(e) => handleEditChange(index, sessionLower, 'description', e.target.value)}
                                                                placeholder={`Nhập kế hoạch ${session === 'mor' ? 'buổi sáng' : session === 'after' ? 'buổi chiều' : 'buổi tối'}...`}
                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                <div className="grid grid-cols-3 gap-10 mt-8 pb-5">

                                    <div
                                        onClick={() => setEditOpen(false)}
                                        className="text-center py-2 px-3 bg-[#6B7280] text-white rounded-md">
                                        Hủy bỏ
                                    </div>
                                    <div
                                        onClick={handleDelete}
                                        className="text-center py-2 px-3 bg-red-600 text-white rounded-md">
                                        Xóa lịch trình
                                    </div>
                                    <div
                                        onClick={handleEdit}
                                        className="text-center py-2 px-3 bg-blue-500 text-white rounded-md">
                                        Lưu lịch trình
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ManageSchedule;