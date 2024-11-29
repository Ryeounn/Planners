'use client';
import { faBaby, faCalendarDays, faChild, faLocationDot, faPlaneDeparture, faQrcode, faTag, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const BookingOfUser = () => {
    const [userId, setUserId] = useState<any>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 4;
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const [booking, setBooking] = useState<any>([]);
    const [result, setResult] = useState<any>([]);
    const [detail, setDetail] = useState<any>([]);
    const [img, setImg] = useState<string>('');
    const [total, setTotal] = useState<any>([]);
    const currentProducts = result.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(result.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userid = sessionStorage.getItem('user');
            setUserId(userid);

            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/getAllOrder`, {
                userid: userid,
            }).then(res => {
                setBooking(res.data);
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
                    
                            // Cộng dồn số lượng và tổng giá theo từng loại vé
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
    }, [userId]);

    return (
        <div>
            <div className="mt-12">
                <div className="grid grid-cols-1 gap-4">
                    {currentProducts.map((item: any) => {
                        const ticketData = total.find((t: any) => t.orderid === item.o_orderid);

                        return (
                            <div key={item.o_orderid} className="w-full h-full rounded-lg border-[1px] border-solid border-[#ccc]">
                                <div className="flex">
                                    <div className="w-[30%] h-[calc(500px-2px)]">
                                        <img className="w-full object-cover h-full rounded-s-lg" src={item.tourpath} alt={item.tourname} />
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
            </div>
        </div>
    )
}

export default BookingOfUser;