'use client';
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { faBook, faCalendarDays, faClipboardCheck, faPieChart, faSignOut, faTag, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";

const SideBar = () => {
    const [activeLink, setActiveLink] = useState<string>('');
    const router = useRouter();
    const pathname = usePathname();

    const handleLinkClick = (link: any) => {
        if (link === pathname) return;
        router.push(link);
    };

    useEffect(() => {
        setActiveLink(pathname);
        const checkAuthentication = async () => {
            if (typeof window !== 'undefined') {
                const role = sessionStorage.getItem('role');
                if (role === 'client') {
                    const result = await Swal.fire({
                        title: 'Từ chối quyền truy cập',
                        text: 'Bạn đang đăng nhập với quyền User và không thể sử dụng được trang của Admin',
                        icon: 'warning',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#f8b602',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false
                    });
                    if (result.isConfirmed) {
                        window.location.href = '/';
                    }
                }
            }
        }
        checkAuthentication();
    }, [router, pathname])

    return (
        <div className="w-[80%] mx-[10%] sticky top-10 mt-10">
            <p className="text-3xl font-bold text-center">Planners<span className="text-[#f8b602]">.</span></p>
            <ul className="w-full space-y-4 mt-10">
                <li>
                    <p className="text-[.85rem] italic my-5">Ứng dụng</p>
                    <a
                        onClick={() => handleLinkClick("dashboard")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md cursor-pointer ${activeLink === "/admin/dashboard"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faWindows} />
                        </div>
                        <div className="w-[70%] text-left">Bảng điều khiển</div>
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => handleLinkClick("analysis")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md cursor-pointer ${activeLink === "/admin/analysis"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faPieChart} />
                        </div>
                        <div className="w-[70%] text-left">Thống kê</div>
                    </a>
                </li>
                <li>
                    <p className="text-[.85rem] italic my-5">Quản lý</p>
                    <a
                        onClick={() => handleLinkClick("tour")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md cursor-pointer ${activeLink === "/admin/tour"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faTag} />
                        </div>
                        <div className="w-[70%] text-left">Du lịch</div>
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => handleLinkClick("users")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md ${activeLink === "/admin/users"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                        href="#"
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faUser} />
                        </div>
                        <div className="w-[70%] text-left">Người dùng</div>
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => handleLinkClick("schedule")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md ${activeLink === "/admin/schedule"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                        href="#"
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faCalendarDays} />
                        </div>
                        <div className="w-[70%] text-left">Lịch trình</div>
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => handleLinkClick("order")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md ${activeLink === "/admin/order"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                        href="#"
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faClipboardCheck} />
                        </div>
                        <div className="w-[70%] text-left">Lịch sử đơn hàng</div>
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => handleLinkClick("blog")}
                        className={`flex items-center justify-center text-center text-[1rem] py-3 rounded-md ${activeLink === "/admin/blog"
                            ? "bg-[#f8b602] text-white"
                            : "bg-white text-[#3c3c3c]"
                            } hover:bg-[#f8b602] hover:text-white`}
                        href="#"
                    >
                        <div className="w-[30%] text-right">
                            <FontAwesomeIcon className="mr-5 text-right" icon={faBook} />
                        </div>
                        <div className="w-[70%] text-left">Bài viết</div>
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;