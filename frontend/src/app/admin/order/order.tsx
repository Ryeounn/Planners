'use client'
import React, { useEffect, useState } from "react";
import Information from "../layout/info";
import Swal from "sweetalert2";
import { checkAuth } from "@/app/auth/auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaby, faCalendarDays, faChild, faPlaneDeparture, faQrcode, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { toast } from "sonner";

const ManageOrder = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [keyword, setKeyword] = useState<any>('');
    const [order, setOrder] = useState<any>([]);
    const [result, setResult] = useState<any>([]);
    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [total, setTotal] = useState<any>([]);
    const [activeStatus, setActiveStatus] = useState("All");
    const [editStatus, setEditStatus] = useState<boolean>(false);
    const [editOrder, setEditOrder] = useState<any>('');
    const [editTotal, setEditTotal] = useState<any>([]);
    const [editResult, setEditResult] = useState<any>([]);
    const [editId, setEditId] = useState<any>('');
    const [chooseStatus, setChooseStatus] = useState<any>('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = currentPage === 1 ? 0 : indexOfLastItem - itemsPerPage;
    const currentOrder = currentPage === 1
        ? result.slice(indexOfFirstItem, indexOfFirstItem + 3)
        : result.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(result.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const statuses = [
        { label: "Tất cả", search: "All", color: "text-gray-500", bg: "bg-gray-500" },
        { label: "Chờ phê duyệt", search: "Pending", color: "text-blue-500", bg: "bg-blue-500" },
        { label: "Đã duyệt", search: "Accept", color: "text-green-500", bg: "bg-green-500" },
        { label: "Đã hủy", search: "Cancel", color: "text-red-500", bg: "bg-red-500" },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const admin = sessionStorage.getItem('admin');
            setAdminid(admin);
        }
    }, [adminid]);

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

    useEffect(() => {
        if(keyword != null && keyword.length >= 6){
            console.log(keyword);
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findManageOrderByKeyWord`, {
                keyword: keyword
            }).then(res => {
                setOrder(res.data);
                console.log(res.data);
                const orderIds = res.data.map((item: any) => item.orderid);
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getAllOrderDetail`, {
                    orderid: orderIds
                }).then(response => {
                    console.log(response.data);
                    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getQuantityTicket`, {
                        orderid: orderIds
                    }).then(r => {
                        const groupedData = r.data.reduce((acc: any, current: any) => {
                            const key = current.orderid;
    
                            if (!acc[key]) {
                                acc[key] = {
                                    orderid: key,
                                    tickets: {
                                        adult: { quantity: 0, totalPrice: 0 },
                                        children: { quantity: 0, totalPrice: 0 },
                                        baby: { quantity: 0, totalPrice: 0 },
                                    },
                                };
                            }
    
                            acc[key].tickets[current.agegroup].quantity += parseInt(current.quantity, 10);
                            acc[key].tickets[current.agegroup].totalPrice += parseFloat(current.quantity) * parseFloat(current.price);
    
                            return acc;
                        }, {});
    
                        const total = Object.values(groupedData);
    
                        setTotal(total);
                        console.log(total);
    
                    }).catch(e => {
                        console.log('Error fetch data: ' + e);
                    });
                    const groupedData = response.data.reduce((acc: any, current: any) => {
                        const key = `${current.o_orderid}-${current.t_tourid}`;
    
                        if (!acc[key]) {
                            acc[key] = { ...current, ticket_quantity: parseInt(current.ticket_quantity) };
                        } else {
                            acc[key].ticket_quantity += parseInt(current.ticket_quantity);
                        }
    
                        return acc;
                    }, {});
                    const result = Object.values(groupedData);
                    setResult(result);
                    console.log(result);
                });
            }).catch(err => {
                console.error('Error fetching order detail:', err);
            });
        }else{
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findManageOrder`, {
                status: activeStatus
            }).then(res => {
                setOrder(res.data);
                console.log(res.data);
                const orderIds = res.data.map((item: any) => item.orderid);
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getAllOrderDetail`, {
                    orderid: orderIds
                }).then(response => {
                    console.log(response.data);
                    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getQuantityTicket`, {
                        orderid: orderIds
                    }).then(r => {
                        const groupedData = r.data.reduce((acc: any, current: any) => {
                            const key = current.orderid;
    
                            if (!acc[key]) {
                                acc[key] = {
                                    orderid: key,
                                    tickets: {
                                        adult: { quantity: 0, totalPrice: 0 },
                                        children: { quantity: 0, totalPrice: 0 },
                                        baby: { quantity: 0, totalPrice: 0 },
                                    },
                                };
                            }
    
                            acc[key].tickets[current.agegroup].quantity += parseInt(current.quantity, 10);
                            acc[key].tickets[current.agegroup].totalPrice += parseFloat(current.quantity) * parseFloat(current.price);
    
                            return acc;
                        }, {});
    
                        const total = Object.values(groupedData);
    
                        setTotal(total);
                        console.log(total);
    
                    }).catch(e => {
                        console.log('Error fetch data: ' + e);
                    });
                    const groupedData = response.data.reduce((acc: any, current: any) => {
                        const key = `${current.o_orderid}-${current.t_tourid}`;
    
                        if (!acc[key]) {
                            acc[key] = { ...current, ticket_quantity: parseInt(current.ticket_quantity) };
                        } else {
                            acc[key].ticket_quantity += parseInt(current.ticket_quantity);
                        }
    
                        return acc;
                    }, {});
                    const result = Object.values(groupedData);
                    setResult(result);
                    console.log(result);
                });
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            });
        }
    }, [activeStatus, keyword]);

    const fetchData = () =>{
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findManageOrder`, {
            status: activeStatus
        }).then(res => {
            setOrder(res.data);
            console.log(res.data);
            const orderIds = res.data.map((item: any) => item.orderid);
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getAllOrderDetail`, {
                orderid: orderIds
            }).then(response => {
                console.log(response.data);
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getQuantityTicket`, {
                    orderid: orderIds
                }).then(r => {
                    const groupedData = r.data.reduce((acc: any, current: any) => {
                        const key = current.orderid;

                        if (!acc[key]) {
                            acc[key] = {
                                orderid: key,
                                tickets: {
                                    adult: { quantity: 0, totalPrice: 0 },
                                    children: { quantity: 0, totalPrice: 0 },
                                    baby: { quantity: 0, totalPrice: 0 },
                                },
                            };
                        }

                        acc[key].tickets[current.agegroup].quantity += parseInt(current.quantity, 10);
                        acc[key].tickets[current.agegroup].totalPrice += parseFloat(current.quantity) * parseFloat(current.price);

                        return acc;
                    }, {});

                    const total = Object.values(groupedData);

                    setTotal(total);
                    console.log(total);

                }).catch(e => {
                    console.log('Error fetch data: ' + e);
                });
                const groupedData = response.data.reduce((acc: any, current: any) => {
                    const key = `${current.o_orderid}-${current.t_tourid}`;

                    if (!acc[key]) {
                        acc[key] = { ...current, ticket_quantity: parseInt(current.ticket_quantity) };
                    } else {
                        acc[key].ticket_quantity += parseInt(current.ticket_quantity);
                    }

                    return acc;
                }, {});
                const result = Object.values(groupedData);
                setResult(result);
                console.log(result);
            });
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        });
    }

    const handleEditStatus = (orderid: number) => {
        setEditId(orderid);
        setEditStatus(true);
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findManageOneOrder`, {
            orderid
        }).then(res => {
            setEditOrder(res.data);
            console.log(res.data);
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getOneOrderDetail`, {
                orderid
            }).then(response => {
                console.log(response.data);
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getOneQuantityTicket`, {
                    orderid
                }).then(r => {
                    console.log("a " + r.data);
                    const groupedData = r.data.reduce((acc: any, current: any) => {
                        const key = current.orderid;

                        if (!acc[key]) {
                            acc[key] = {
                                orderid: key,
                                tickets: {
                                    adult: { quantity: 0, totalPrice: 0 },
                                    children: { quantity: 0, totalPrice: 0 },
                                    baby: { quantity: 0, totalPrice: 0 },
                                },
                            };
                        }

                        acc[key].tickets[current.agegroup].quantity += parseInt(current.quantity, 10);
                        acc[key].tickets[current.agegroup].totalPrice += parseFloat(current.quantity) * parseFloat(current.price);

                        return acc;
                    }, {});

                    const total = Object.values(groupedData);

                    setEditTotal(total);
                    console.log(total);

                }).catch(e => {
                    console.log('Error fetch data: ' + e);
                });
                const groupedData = response.data.reduce((acc: any, current: any) => {
                    const key = `${current.o_orderid}-${current.t_tourid}`;

                    if (!acc[key]) {
                        acc[key] = { ...current, ticket_quantity: parseInt(current.ticket_quantity) };
                    } else {
                        acc[key].ticket_quantity += parseInt(current.ticket_quantity);
                    }

                    return acc;
                }, {});
                const result = Object.values(groupedData);
                setEditResult(result);
                console.log(result);
            }).catch(error => {
                console.log('Error fetch data: ' + error);
            })
        })
    }

    const handleChangeStatus = () => {
        console.log(editId);
        console.log(chooseStatus);
        if (chooseStatus) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/updateStatus`, {
                orderid: editId,
                condition: chooseStatus
            }).then(res => {
                fetchData();
                const currentDate = new Date();
                const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                const successMessage = 'Cập nhật đơn hàng thành công';
                toast.success(successMessage, {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                setEditStatus(false);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return (
        <div className={isAuthenticated ? '' : 'blurred-content'}>
            <div className="mx-10">
                <div className="flex items-center justify-between">
                    <p className="text-[1.2rem] font-sans font-semibold">Đơn hàng</p>
                    <div className="w-[35%] flex items-center justify-around">
                        <input
                            type="text"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Nhập mã đơn hàng..."
                            className="w-[75%] mr-3 py-1 px-3 border-[1px] border-solid border-[#ccc] focus:outline-none rounded-md" />
                        <Information />
                    </div>
                </div>
                <div className="mt-10">
                    <div className="flex items-center justify-between">
                        <div>Trạng thái</div>
                        <div className="flex space-x-3">
                            {statuses.map((status) => (
                                <p
                                    key={status.label}
                                    onClick={() => setActiveStatus(status.search)}
                                    className={`w-[150px] text-center py-1 font-semibold cursor-pointer ${status.color} ${activeStatus === status.search ? `relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[3px] after:bg-[#f8b602]` : ""
                                        }`}
                                >
                                    {status.label}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="mt-5 space-y-2">
                        {currentOrder.map((item: any) => {
                            const ticketData = total.find((t: any) => t.orderid === item.o_orderid);
                            return (
                                <div key={item.o_orderid} onClick={() => handleEditStatus(item.o_orderid)} className="w-full h-[520px] rounded-lg border-[1px] border-solid border-[#ccc] cursor-pointer">
                                    <div className="flex">
                                        <div className="w-[30%] h-[calc(520px-2px)]">
                                            <img loading="lazy" className="w-full object-cover h-full rounded-s-lg" src={item.tourpath} alt={item.tourname} />
                                        </div>
                                        <div className="w-[70%] flex flex-col p-4">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-bold mb-0">{item.tourname} - {formatDate(item.startdate)}</h2>
                                                <div>
                                                    <FontAwesomeIcon className="mr-2" icon={faQrcode} />
                                                    <span className="text-[18px] font-semibold">{item.o_ordercode}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[12px] w-fit text-white py-[2px] font-semibold px-3 rounded-[50px] bg-[#0B8494]">{item.tourcode}</p>
                                                <span className={`text-[12px] w-fit text-white py-[2px] px-3 rounded-[50px] bg-slate-400 ${item.o_condition === 'Pending' ? '!bg-blue-600' : `${item.o_condition === 'Accept' ? '!bg-green-600' : '!bg-[rgb(230,0,18)]'}`}`}>{item.o_condition}</span>
                                            </div>
                                            <p className="mt-4 mr-10 text-gray-600">{item.desclong}</p>
                                            <p className="mt-5 font-semibold font-serif">Trip information</p>
                                            <div className="flex space-x-2">
                                                <div className="mt-3 flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                    <FontAwesomeIcon className="mr-2" icon={faPlaneDeparture} /> Departure: {formatDate(item.startdate)}
                                                </div>
                                                <div className="mt-3 flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                    <p className="flex items-center"><img className="w-[30px] h-[30px] rounded-[50%] mr-2" src={item.imgairline} /> {item.airline}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                <FontAwesomeIcon className="mr-2" icon={faCalendarDays} /> Total: {item.totaldate} days {item.totaldate - 1} nights
                                            </div>
                                            <p className="mt-8 font-semibold font-serif">Total number of tickets: <span className="font-montserrat">{item.ticket_quantity}</span></p>
                                            <div>
                                                <div className="mt-3 flex">
                                                    <div className="flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                        <FontAwesomeIcon className="mr-2" icon={faUserTie} />
                                                        {ticketData ? (
                                                            <>
                                                                <span>Adult: {ticketData.tickets.adult.quantity} x ${ticketData.tickets.adult.totalPrice}</span>
                                                            </>
                                                        ) : (
                                                            <span>No tickets available</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg mx-2">
                                                        <FontAwesomeIcon className="mr-2" icon={faChild} />
                                                        {ticketData ? (
                                                            <>
                                                                <span> Children: {ticketData.tickets.children.quantity} x ${ticketData.tickets.children.totalPrice}</span>
                                                            </>
                                                        ) : (
                                                            <span>No tickets available</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                        <FontAwesomeIcon className="mr-2" icon={faBaby} />
                                                        {ticketData ? (
                                                            <>
                                                                <span> Baby: {ticketData.tickets.baby.quantity} x ${ticketData.tickets.baby.totalPrice}</span>
                                                            </>
                                                        ) : (
                                                            <span>No tickets available</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5 flex items-center justify-between">
                                                <div></div>
                                                <div>
                                                    <p>Order Total: <span className="mt-1 text-2xl font-semibold text-[#FF6500]">${item.o_totalprice}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center my-5 p-[10px_0]">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`mx-1 ${number === currentPage ? 'bg-[#000000] text-[#fff] rounded-[50%] font-bold w-[40px] h-[40px] p-[5px]' : 'bg-[#eee] text-[#374151] rounded-[50%] w-[40px] h-[40px] p-[5px] '} hover:bg-[#89bde7] hover:text-[#000]`}
                            >
                                {number}
                            </button>
                        ))}
                        {editStatus && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer overflow-y-auto" onClick={() => setEditStatus(false)}>
                                <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                                    <h2 className="text-xl text-center font-semibold my-4">Cập nhật trạng thái</h2>
                                    {editResult.map((item: any) => {
                                        const ticketData = editTotal.find((t: any) => t.orderid === item.o_orderid);
                                        return (
                                            <div key={item.o_orderid} className="w-full h-[560px] rounded-lg border-[1px] border-solid border-[#ccc] cursor-pointer">
                                                <div className="flex">
                                                    <div className="w-[30%] h-[calc(560px-2px)]">
                                                        <img loading="lazy" className="w-full object-cover h-full rounded-s-lg" src={item.tourpath} alt={item.tourname} />
                                                    </div>
                                                    <div className="w-[70%] flex flex-col p-4">
                                                        <div className="flex justify-between items-center">
                                                            <h2 className="text-lg font-bold mb-0">{item.tourname} - {formatDate(item.startdate)}</h2>
                                                            <div>
                                                                <FontAwesomeIcon className="mr-2" icon={faQrcode} />
                                                                <span className="text-[18px] font-semibold">{item.o_ordercode}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-[12px] w-fit text-white py-[2px] font-semibold px-3 rounded-[50px] bg-[#0B8494]">{item.tourcode}</p>
                                                            <span className={`text-[12px] w-fit text-white py-[2px] px-3 rounded-[50px] bg-slate-400 ${item.o_condition === 'Pending' ? '!bg-blue-600' : `${item.o_condition === 'Accept' ? '!bg-green-600' : '!bg-[rgb(230,0,18)]'}`}`}>{item.o_condition}</span>
                                                        </div>
                                                        <p className="mt-4 mr-10 text-gray-600">{item.desclong}</p>
                                                        <p className="mt-5 font-semibold font-serif">Trip information</p>
                                                        <div className="flex space-x-2">
                                                            <div className="mt-3 flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                                <FontAwesomeIcon className="mr-2" icon={faPlaneDeparture} /> Departure: {formatDate(item.startdate)}
                                                            </div>
                                                            <div className="mt-3 flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                                <p className="flex items-center"><img className="w-[30px] h-[30px] rounded-[50%] mr-2" src={item.imgairline} /> {item.airline}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                            <FontAwesomeIcon className="mr-2" icon={faCalendarDays} /> Total: {item.totaldate} days {item.totaldate - 1} nights
                                                        </div>
                                                        <p className="mt-8 font-semibold font-serif">Total number of tickets: <span className="font-montserrat">{item.ticket_quantity}</span></p>
                                                        <div>
                                                            <div className="mt-3 flex">
                                                                <div className="flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                                    <FontAwesomeIcon className="mr-2" icon={faUserTie} />
                                                                    {ticketData ? (
                                                                        <>
                                                                            <span>Adult: {ticketData.tickets.adult.quantity} x ${ticketData.tickets.adult.totalPrice}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span>No tickets available</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg mx-2">
                                                                    <FontAwesomeIcon className="mr-2" icon={faChild} />
                                                                    {ticketData ? (
                                                                        <>
                                                                            <span> Children: {ticketData.tickets.children.quantity} x ${ticketData.tickets.children.totalPrice}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span>No tickets available</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center border-2 border-solid border-[#dfdfdf] w-fit py-1 px-2 rounded-lg">
                                                                    <FontAwesomeIcon className="mr-2" icon={faBaby} />
                                                                    {ticketData ? (
                                                                        <>
                                                                            <span> Baby: {ticketData.tickets.baby.quantity} x ${ticketData.tickets.baby.totalPrice}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span>No tickets available</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-5 flex items-center justify-between">
                                                            <div></div>
                                                            <div>
                                                                <p>Order Total: <span className="mt-1 text-2xl font-semibold text-[#FF6500]">${item.o_totalprice}</span></p>
                                                                <select value={chooseStatus} onChange={(e) => setChooseStatus(e.target.value)} className="w-full mt-5 py-1 px-3 border-[1px] border-solid border-[#ccc] rounded-md">
                                                                    <option value="">Chọn</option>
                                                                    <option value="Accept">Duyệt đơn hàng</option>
                                                                    <option value="Cancel">Hủy đơn hàng</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="grid grid-cols-4 gap-10 mt-8">
                                        <div></div>
                                        <div
                                            onClick={() => setEditStatus(false)}
                                            className="text-center py-2 px-3 bg-[#6B7280] text-white rounded-md">
                                            Hủy bỏ
                                        </div>
                                        <div
                                            onClick={handleChangeStatus}
                                            className="text-center py-2 px-3 bg-blue-500 text-white rounded-md">
                                            Lưu thay đổi
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageOrder;