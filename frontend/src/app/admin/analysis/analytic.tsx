'use client';
import { checkAuth } from "@/app/auth/auth";
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Information from "../layout/info";
import { Bar, Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    registerables
} from 'chart.js';
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ...registerables);

const Analytic = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [keyword, setKeyword] = useState<any>('');
    const [filter, setFilter] = useState<any>('All');
    const [chartData, setChartData] = useState<any>(null);
    const [chartPie, setChartPie] = useState<any>(null);
    const [chartBar, setCharBar] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const admin = sessionStorage.getItem('admin');
            setAdminid(admin);
        }
    }, [adminid]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/getRevenueToday`, { filter })
            .then(res => {
                const data = res.data;
                if (!data) {
                    console.error("No data returned from API");
                    return;
                }

                if (filter === '1 year' && data.months && data.revenues) {
                    setChartData({
                        labels: data.months,
                        datasets: [
                            {
                                label: 'Revenue',
                                data: data.revenues,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 2,
                                fill: true,
                                backgroundColor: (context: any) => {
                                    const chart = context.chart;
                                    const ctx = chart.ctx;
                                    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                                    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
                                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
                                    return gradient;
                                },
                            },
                        ],
                    });
                } else if (['2 years', '3 years'].includes(filter) && data.years && data.revenues) {
                    setChartData({
                        labels: data.years,
                        datasets: [
                            {
                                label: 'Revenue',
                                data: data.revenues,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 2,
                                fill: true,
                                backgroundColor: (context: any) => {
                                    const chart = context.chart;
                                    const ctx = chart.ctx;
                                    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                                    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.8)');
                                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
                                    return gradient;
                                },
                            },
                        ],
                    });
                } else {
                    setChartData({
                        labels: data.years ? data.years : data.months,
                        datasets: [
                            {
                                label: `Revenue (${filter})`,
                                data: data.revenues || 0,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 2,
                                fill: true,
                                backgroundColor: (context: any) => {
                                    const chart = context.chart;
                                    const ctx = chart.ctx;
                                    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                                    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
                                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
                                    return gradient;
                                },
                            },
                        ],
                    });
                }
            }).catch(err => {
                console.error('Error fetching data:', err);
            });
    }, [filter]);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orderdetail/getTop10Tour`)
            .then(res => {
                console.log(res.data);
                const apiData = res.data;

                const labels = apiData.map((item: any) => item.tourname);
                const data = apiData.map((item: any) => parseInt(item.total_orders, 10));

                setChartPie({
                    labels,
                    datasets: [
                        {
                            label: 'Top 10 Tours',
                            data,
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                                '#FF9F40',
                                '#FFCD56',
                                '#36A3EB',
                                '#C9CBCF',
                                '#FF8E72',
                            ],
                            hoverBackgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                                '#FF9F40',
                                '#FFCD56',
                                '#36A3EB',
                                '#C9CBCF',
                                '#FF8E72',
                            ],
                        },
                    ],
                });
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, []);

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/getRegistrationCountPerMonth`)
            .then(res => {
                const data = res.data;
                const months = data.map((item: any) => item.month);
                const registrationCounts = data.map((item: any) => item.registrationCount);

                setCharBar({
                    labels: months.map((month: number) => `Tháng ${month}`),
                    datasets: [
                        {
                            label: 'Số lượng đăng ký',
                            data: registrationCounts,
                            backgroundColor: '#36A2EB',
                            borderColor: '#36A2EB',
                            borderWidth: 1,
                        },
                    ],
                });
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, []);


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Revenue Chart (${filter})`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Revenue',
                },
                beginAtZero: true,
            },
        },
    };

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

    return (
        <div>
            <div className={isAuthenticated ? '' : 'blurred-content'}>
                <div className="mx-10">
                    <div className="flex items-center justify-between">
                        <p className="text-[1.2rem] font-sans font-semibold">Thống kê</p>
                        <div className="w-[35%] flex items-center justify-around">
                            <input
                                type="text"
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Nhập địa chỉ email người dùng..."
                                className="w-[75%] mr-3 py-1 px-3 border-[1px] border-solid border-[#ccc] focus:outline-none rounded-md opacity-0 pointer-events-none" />
                            <Information />
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="w-full h-[550px] mr-[1%] bg-white shadow-md rounded-md p-8">
                            <div className="flex items-center justify-between mx-5">
                                <p className="text-[1.1rem] px-3 font-semibold">Biểu đồ thống kê doanh thu</p>
                                <div>
                                    <select className="py-1 px-3 rounded-lg border-[1px] border-solid border-[#ccc] focus:outline-none" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                        <option value="All">All</option>
                                        <option value="Today">Today</option>
                                        <option value="3 days">3 days</option>
                                        <option value="7 days">7 days</option>
                                        <option value="14 days">14 days</option>
                                        <option value="21 days">21 days</option>
                                        <option value="month">1 month</option>
                                        <option value="1 year">1 year</option>
                                        <option value="2 years">2 years</option>
                                        <option value="3 years">3 years</option>
                                    </select>
                                </div>
                            </div>
                            {chartData ? (
                                <Line className="!w-[1100px]" data={chartData} options={options} />
                            ) : (
                                <p>Loading chart data...</p>
                            )}

                        </div>
                    </div>
                    <div className="my-5">
                        <div className="flex">
                            <div className="w-[34%] h-[500px] mr-[1%] bg-white shadow-md rounded-md">
                                <p className="text-[1.1rem] px-3 font-semibold my-5">Top 10 Tour được bán nhiều nhất</p>
                                {chartPie ? (
                                    <Doughnut
                                        data={chartPie}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'bottom',
                                                    labels: {
                                                        usePointStyle: true,
                                                        pointStyle: 'circle',
                                                        font: {
                                                            size: 12,
                                                        },
                                                        padding: 10,
                                                        boxWidth: 8,
                                                        boxHeight: 8,
                                                    },
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (context) {
                                                            const value: any = context.raw;
                                                            return `$${value.toLocaleString()}`;
                                                        },
                                                    },
                                                },
                                            },
                                            cutout: '80%',
                                        }}
                                    />
                                ) : (
                                    <p>Loading chart data...</p>
                                )}
                            </div>
                            <div className="w-[74%] h-[500px] ml-[1%] bg-white shadow-md rounded-md">
                                <p className="text-[1.1rem] px-3 font-semibold my-5 pb-10">Số lượng khách hàng đăng ký hệ thống theo năm</p>
                                <div className="">
                                {chartBar ? (
                                    <Bar
                                        data={{
                                            ...chartBar,
                                            datasets: chartBar.datasets.map((dataset: any) => ({
                                                ...dataset,
                                                barThickness: 25,
                                                borderRadius: 10,
                                            })),
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (context: any) {
                                                            const value = context.raw;
                                                            return `${value} người`;
                                                        },
                                                    },
                                                },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Tháng',
                                                    },
                                                },
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng đăng ký',
                                                    },
                                                    beginAtZero: true,
                                                    suggestedMax: (Math.max(...chartBar.datasets[0].data) * 1.2),
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <p>Đang tải dữ liệu...</p>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Analytic;

