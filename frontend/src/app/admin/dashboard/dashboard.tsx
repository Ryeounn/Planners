'use client';
import { checkAuth } from "@/app/auth/auth";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Information from "../layout/info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPieChart, faPlus, faTags, faUser } from "@fortawesome/free-solid-svg-icons";
import { Bar, Line } from 'react-chartjs-2';
import axios from "axios";
import { useRouter } from "next/navigation";
import { Chart, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
Chart.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement,);

const DashBoard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [totalTour, setTotalTour] = useState<any>('');
    const [totalUser, setTotalUser] = useState<any>('');
    const [totalOrder, setTotalOrder] = useState<any>('');
    const [totalProduct, setTotalProduct] = useState<any>('');
    const [dataChartOrder, setDataChartOrder] = useState<any>('');
    const [dataChartLine, setDataChartLine] = useState<any>('');
    const [adminname, setAdminname] = useState<string | null>('');
    const [adminpath, setAdminpath] = useState<string | null>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [chartData, setChartData] = useState<any>(null);
    const [lineData, setLineData] = useState<any>(null);
    const [topTour, setTopTour] = useState<any>([]);
    const [tour, setTour] = useState<any>([]);
    const [search, setSearch] = useState<string>('');
    const [topUsers, setTopUsers] = useState<any>([]);
    const router = useRouter();
    const itemsPerPage: number = 10;
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = tour.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tour.length / itemsPerPage); i++) {
        pageNumbers.push(i);
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

    useEffect(() => {
        if (isAuthenticated && typeof window !== 'undefined') {
            const id = sessionStorage.getItem('admin');
            const name = sessionStorage.getItem('adminname');
            const path = sessionStorage.getItem('adminavatar');

            setAdminid(id);
            setAdminname(name);
            setAdminpath(path);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/findAllTourCount`)
            .then(res => {
                setTotalTour(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [adminid]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/findAllUserCount`)
            .then(res => {
                setTotalUser(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [adminid]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findAllOrderCount`)
            .then(res => {
                setTotalOrder(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [adminid]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/sumProductSold`)
            .then(res => {
                setTotalProduct(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [adminid]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/findQuantityEachTicket`)
            .then(res => {
                setDataChartOrder(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/sumRevenue`)
            .then(res => {
                setDataChartLine(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [adminid]);

    useEffect(() => {
        if (dataChartOrder) {
            const data = {
                labels: dataChartOrder.map((tour: any) => tour.tourName),
                datasets: [
                    {
                        label: 'Số lượng bán',
                        data: dataChartOrder.map((tour: any) => Number(tour.totalSold)),
                        backgroundColor: 'rgba(75,192,192,.6)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            };

            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top' as const,
                    },
                    title: {
                        display: true,
                        text: 'Tổng số lượng bán các tour',
                        font: {
                            size: 20,
                            weight: 'bold',
                            family: 'Arial',
                        },
                        color: 'black',
                    },
                },
            };

            setChartData({ data, options });
        }

        if (dataChartLine) {
            const data = {
                labels: dataChartLine.map((year: any) => year.year),
                datasets: [
                    {
                        label: 'Tổng doanh thu',
                        data: dataChartLine.map((total: any) => Number(total.totalrevenue)),
                        backgroundColor: 'rgba(236, 131, 5, 0.5)',
                        borderColor: 'rgb(236, 131, 5)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                    },
                ],
            };

            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top' as const,
                    },
                    title: {
                        display: true,
                        text: 'Tổng doanh thu theo năm',
                        font: {
                            size: 20,
                            weight: 'bold',
                            family: 'Arial',
                        },
                        color: 'black',
                    },
                },
            };

            setLineData({ data, options });
        }

    }, [dataChartOrder, dataChartLine]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/findTopThreeTour`)
            .then(res => {
                setTopTour(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, []);

    useEffect(() => {
        if (search != '') {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findOrderByOrderCode`, {
                ordercode: search
            }).then(res => {
                setTour(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findAllOrderAndUser`)
                .then(res => {
                    setTour(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }
    }, [search]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/getTopUsers`)
            .then(res => {
                setTopUsers(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return (
        <div className={isAuthenticated ? '' : 'blurred-content'}>
            <div className="mx-10">
                <div className="flex items-center justify-between">
                    <p className="text-[1.2rem] font-sans">Xin chào, <span className="font-bold">{adminname}</span></p>
                    <Information />
                </div>
                <div className="mt-8">
                    <div className="flex space-x-3">
                        <div onClick={() => router.push('/admin/tour')} className="w-[70%] h-[300px] rounded-md border-[1px] border-solid border-[#ccc] relative">
                            <video
                                className="w-full h-full object-cover rounded-md"
                                src="/assets/videos/admin/dashboard/create.mp4"
                                autoPlay
                                loop
                                muted />
                            <div className="absolute inset-0 bg-white opacity-50"></div>
                            <button onClick={() => router.push('/admin/tour')} className="absolute bottom-5 left-5 transform text-white bg-[#f8b602] px-4 py-2 rounded">
                                <FontAwesomeIcon className="mr-3" icon={faPlus} />
                                Tạo tour du lịch mới
                            </button>
                        </div>
                        <div className="w-[30%] h-[300px] rounded-md border-[1px] border-solid border-[#ccc] bg-white py-[15px] space-y-[18px] px-4">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="h-[125px] text-white bg-[#f8b602] px-2 rounded-md border-[1px] border-solid border-[#ccc]">
                                    <div className="text-[.8rem] font-medium mt-2">Tổng du lịch có sẵn</div>
                                    <div className="text-[2rem] font-semibold font-sans">{totalTour}</div>
                                    <div className="inline-block float-right">
                                        <div className="flex items-center justify-center w-[45px] h-[45px] py-2 px-2 bg-white border-[1px] border-solid border-white rounded-[50%]">
                                            <FontAwesomeIcon className="text-[1.70rem] text-[#f8b602]" icon={faTags} />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[125px] text-white bg-[#ff3ca6] px-2 rounded-md border-[1px] border-solid border-[#ccc]">
                                    <div className="text-[.8rem] text-right font-medium mt-2">Tổng khách hàng</div>
                                    <div className="text-[2rem] text-right font-semibold font-sans">{totalUser}</div>
                                    <div className="inline-block float-left">
                                        <div className="flex items-center justify-center w-[45px] h-[45px] py-2 px-2 bg-white border-[1px] border-solid border-white rounded-[50%]">
                                            <FontAwesomeIcon className="text-[1.70rem] text-[#ff3ca6]" icon={faUser} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="h-[125px] text-white bg-[#3f50f6] pt-1 px-2 rounded-md border-[1px] border-solid border-[#ccc]">
                                    <div className="inline-block float-right">
                                        <div className="flex items-center justify-center w-[45px] h-[45px] py-2 px-2 bg-white border-[1px] border-solid border-white rounded-[50%]">
                                            <FontAwesomeIcon className="text-[1.70rem] text-[#3f50f6]" icon={faListUl} />
                                        </div>
                                    </div>
                                    <div className="text-[2rem] text-left font-semibold font-sans mt-11">{totalOrder}</div>
                                    <div className="text-[.8rem] text-left font-medium">Tổng đơn hàng</div>
                                </div>
                                <div className="h-[125px] text-white bg-[#0b8494] pt-1 px-2 rounded-md border-[1px] border-solid border-[#ccc]">
                                    <div className="inline-block float-left">
                                        <div className="flex items-center justify-center w-[45px] h-[45px] py-2 px-2 bg-white border-[1px] border-solid border-white rounded-[50%]">
                                            <FontAwesomeIcon className="text-[1.70rem] text-[#0b8494]" icon={faPieChart} />
                                        </div>
                                    </div>
                                    <div className="text-[2rem] text-right font-semibold font-sans mt-11">{totalProduct}</div>
                                    <div className="text-[.8rem] text-right font-medium">Tổng sản phẩm bán ra</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="flex space-x-3">
                        <div className="w-[50%] h-[350px] bg-white p-4 rounded-md border-[1px] border-solid border-[#ccc]">
                            {chartData &&
                                <Bar data={chartData.data} options={chartData.options} />
                            }
                        </div>
                        <div className="w-[50%] h-[350px] bg-white p-4 rounded-md border-[1px] border-solid border-[#ccc]">
                            {lineData &&
                                <Line data={lineData.data} options={lineData.options} />
                            }
                        </div>
                    </div>
                </div>
                <div className="my-10">
                    <div className="flex space-x-3">
                        <div className="w-[40%]">
                            <p className="text-[1.25rem] font-sans font-semibold mb-3">Tổng số lượng bán các tour</p>
                            <div className="bg-white p-4 rounded-md">
                                <div className="mt-5 space-y-5">
                                    {topTour.map((item: any, index: number) => (
                                        <div key={item.tourid} className="py-3 px-3 h-[85px] rounded-lg border-t-[1px] border-solid border-[#ccc] shadow-md">
                                            <div className="flex">
                                                <div className="w-[15%]">
                                                    <div className={`flex justify-center items-center w-[60px] h-[60px] rounded-[50%] ${index === 0 ? 'bg-[#FFE31A]' : `${index === 1 ? 'bg-[#DBD3D3]' : 'bg-[#AB886D]'}`}`}>
                                                        <p className="text-[2rem] font-bold font-serif">{index + 1}</p>
                                                    </div>
                                                </div>
                                                <div className="w-[85%]">
                                                    <div className="flex items-center pl-4">
                                                        <div className="w-[50%] h-full">
                                                            <p className="text-[1rem]">{item.tourname}</p>
                                                            <p>Số lượng: {item.totalSold}</p>
                                                        </div>
                                                        <div className="w-[50%] h-full">
                                                            <img className="w-full h-[60px] object-cover rounded-md" src={item.tourpath} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[1.25rem] font-sans font-semibold mt-8 mb-3">Top mua</p>
                            <div className="bg-white p-4 rounded-md">

                                <div className="flex items-end justify-center space-x-8 space-y-8">

                                        <div className="flex flex-col items-center">
                                            <img
                                                src={topUsers[1]?.userpath}
                                                alt="Rank 2"
                                                className="w-16 h-16 rounded-full border-2 border-gray-300"
                                            />
                                            <p className="mt-2 text-sm font-medium">{topUsers[1]?.username ? topUsers[1]?.username : '?'}</p>
                                            <p className="text-xs text-gray-500">${topUsers[1]?.total ? topUsers[1]?.total : '?'}</p>
                                        </div>


                                    <div className="flex flex-col items-center relative mt-10">
                                        <div className="absolute -top-5 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs">🥇</div>
                                        <img
                                            src={topUsers[0]?.userpath}
                                            alt="Rank 1"
                                            className="w-20 h-20 rounded-full border-4 border-yellow-400"
                                        />
                                        <p className="mt-3 text-sm font-medium">{topUsers[0]?.username}</p>
                                        <p className="text-xs text-gray-500">${topUsers[0]?.total}</p>
                                    </div>
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={topUsers[2]?.userpath}
                                                alt="Rank 3"
                                                className="w-16 h-16 rounded-full border-2 border-gray-300"
                                            />
                                            <p className="mt-2 text-sm font-medium">{topUsers[2]?.username ? topUsers[2]?.username : '?'}</p>
                                            <p className="text-xs text-gray-500">${topUsers[2]?.total ? topUsers[2]?.total : '?'}</p>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[60%]">
                            <div className="flex items-center justify-between">
                                <p className="text-[1.25rem] font-sans font-semibold mb-3">Chi tiết đặt hàng</p>
                                <input
                                    type="text"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nhập mã đơn hàng để tìm kiếm..."
                                    className="w-[40%] rounded-md focus:outline-none py-1 px-2 border-[1px] border-solid border-[#ccc]" />
                            </div>
                            <div className="bg-white p-4 rounded-md space-y-3">
                                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-blue-500 text-white text-sm leading-normal">
                                            <th className="py-3 px-4 text-left">#</th>
                                            <th className="py-3 px-4 text-left">Mã đặt hàng</th>
                                            <th className="py-3 px-4 text-left">Ngày đặt hàng</th>
                                            <th className="py-3 px-4 text-left">Tổng số lượng</th>
                                            <th className="py-3 px-4 text-left">Tổng giá</th>
                                            <th className="py-3 px-4 text-left">Người đặt hàng</th>
                                            <th className="py-3 px-4 text-left">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {currentProducts.map((item: any, index: number) => (
                                            <tr key={item.orderid} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-4 text-left whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="py-3 px-4 text-left">{item.ordercode}</td>
                                                <td className="py-3 px-4 text-left">{formatDate(item.orderdate)}</td>
                                                <td className="py-3 px-4 text-left">{item.totalquantity}</td>
                                                <td className="py-3 px-4 text-left">${item.totalprice}</td>
                                                <td className="py-3 px-4 text-left">{item.user.username}</td>
                                                <td className={`py-3 px-5 text-left text-[12px] text-white font-bold ${item.condition === 'Pending' ? '!text-blue-600' : `${item.condition === 'Accept' ? '!text-green-600' : '!text-[rgb(230,0,18)]'}`}`}>{item.condition}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-center mt-6 my-5 p-[10px_0]">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
