'use client';
import { checkAuth } from "@/app/auth/auth";
import { faAngleRight, faBaby, faBell, faCalendarDays, faChild, faPlaneDeparture, faPlus, faQrcode, faShield, faUser, faUserTie, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Information = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<any>('');
    const [adminname, setAdminname] = useState<any>('');
    const [admin, setAdmin] = useState<any>('');
    const [adminpath, setAdminpath] = useState<any>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newOrder, setNewOrder] = useState<any>([]);
    const [editStatus, setEditStatus] = useState<boolean>(false);
    const [editTotal, setEditTotal] = useState<any>([]);
    const [editResult, setEditResult] = useState<any>([]);
    const [editId, setEditId] = useState<any>('');
    const [editOrder, setEditOrder] = useState<any>('');
    const [chooseStatus, setChooseStatus] = useState<any>('');
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const [settingOpen, setSettingOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<any>("personalInfo");
    const [fetchData, setFetchData] = useState<boolean>(false);
    const [myInfo, setMyInfo] = useState<boolean>(true);
    const [myPass, setMyPass] = useState<boolean>(false);
    const [nameOpen, setNameOpen] = useState<boolean>(false);
    const [genderOpen, setGenderOpen] = useState<boolean>(false);
    const [birthdayOpen, setBirthdayOpen] = useState<boolean>(false);
    const [avatarOpen, setAvatarOpen] = useState<boolean>(false);
    const [passOpen, setPassOpen] = useState<boolean>(false);
    const [showBadge, setShowBadge] = useState<boolean>(true);

    const [editName, setEditName] = useState<any>('');
    const [editGender, setEditGender] = useState<any>('');
    const [editBirthday, setEditBirthday] = useState<any>('');
    const [editAvatar, setEditAvatar] = useState<any>('');
    const [editImage, setEditImage] = useState<any>('');
    const [editOldPass, setEditOldPass] = useState<any>('');
    const [editNewPass, setEditNewPass] = useState<any>('');
    const [editConfirmPass, setEditConfirmPass] = useState<any>('');
    const [forgetEmail, setForgetEmail] = useState<any>('');
    const [vetifyCode, setVetifyCode] = useState<any>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

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

            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/admins/findById`, {
                adminid: id
            }).then(res => {
                const fetchedBirthday = res.data.birthday
                    ? format(new Date(res.data.birthday), "yyyy-MM-dd")
                    : "";
                setAdmin(res.data);
                setForgetEmail(res.data.email);
                setEditName(res.data.adminname);
                setEditGender(res.data.gender);
                setEditBirthday(fetchedBirthday);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        }
    }, [isAuthenticated, fetchData]);

    const toggleShowModal = () => {
        setShowBadge(false);
        setShowModal((prev) => {
            if (prev) {
                return false;
            }
            setOpenProfile(false);
            return true;
        });
    };

    useEffect(() => {
        if (settingOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [settingOpen]);

    const toggleOpenProfile = () => {
        setOpenProfile((prev) => {
            if (prev) {
                return false;
            }
            setShowModal(false);
            return true;
        });
    };

    const handleSetting = () => {
        setOpenProfile(false);
        setShowModal(false);
        setSettingOpen(true);
    }

    const handleEditStatus = (orderid: number) => {
        setEditId(orderid);
        setEditStatus(true);
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/updateSeen`, {
            orderid
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        });

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/updateSeen`, { orderid })
            .then(() => {
                setNewOrder((prevOrders: any) =>
                    prevOrders.map((order: any) =>
                        order.orderid === orderid ? { ...order, isseen: "True" } : order
                    )
                );
                console.log(`Order ${orderid} updated to seen.`);
            })
            .catch((err) => {
                console.log('Error updating seen status: ' + err);
            });

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

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/findOrderNew`)
            .then(res => {
                setNewOrder(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, [showBadge]);

    const handleInfo = () => {
        setMyInfo(true);
        setMyPass(false);
    }

    const handlePass = () => {
        setMyInfo(false);
        setMyPass(true);
    }

    const handleLogout = () => {
        Swal.fire({
            title: 'Bạn có muốn đăng xuất chứ?',
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đăng xuất!',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('admintoken');
                sessionStorage.removeItem('admin');
                sessionStorage.removeItem('adminname');
                sessionStorage.removeItem('adminavatar');
                sessionStorage.removeItem('role');
                router.push('/');
            } else {
                console.log('Fail');
            }
        })
    }


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

    const handleChangeFile = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file.name);
            const previewUrl = URL.createObjectURL(file);
            setEditImage(previewUrl);
            setEditAvatar({ file: file, fileName: file.name, type: 'image' });
        }
    }

    const handleChangeName = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        if (editName && adminid) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/admins/editName`, {
                adminid,
                adminname: editName
            }).then(res => {
                setNameOpen(false);
                setFetchData((pre: any) => !pre);
                let errorMessage = 'Cập nhật họ và tên thành công';
                toast.success(errorMessage.trim(), {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            let errorMessage = 'Cập nhật họ và tên thất bại';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    }

    const handleChangeGender = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        if (editGender && adminid) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/admins/editGender`, {
                adminid,
                gender: editGender
            }).then(res => {
                setGenderOpen(false);
                setFetchData((pre: any) => !pre);
                let errorMessage = 'Cập nhật giới tính thành công';
                toast.success(errorMessage.trim(), {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            let errorMessage = 'Cập nhật giới tính thất bại';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    }

    const handleChangeBirthday = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        if (editBirthday && adminid) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/admins/editBirthday`, {
                adminid,
                birthday: editBirthday
            }).then(res => {
                setBirthdayOpen(false);
                setFetchData((pre: any) => !pre);
                let errorMessage = 'Cập nhật ngày sinh thành công';
                toast.success(errorMessage.trim(), {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            let errorMessage = 'Cập nhật ngày sinh thất bại';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    }

    const handleChangeAvatar = async () => {
        const result = await handleUpload(editAvatar.file);
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        if (result && adminid) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/admins/editAvatar`, {
                adminid,
                avatar: result
            }).then(res => {
                setAvatarOpen(false);
                setFetchData((pre: any) => !pre);
                let errorMessage = 'Cập nhật ảnh đại diên thành công';
                toast.success(errorMessage.trim(), {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            let errorMessage = 'Cập nhật ảnh đại diện thất bại';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    }

    const handleChangePassword = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        if (editOldPass && editNewPass && editConfirmPass) {
            if (editOldPass !== editNewPass) {
                if (editNewPass.length >= 8) {
                    if (editNewPass === editConfirmPass) {
                        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/admins/editPassword`, {
                            adminid,
                            oldpassword: editOldPass,
                            password: editNewPass
                        }).then(res => {
                            if (res.data.success) {
                                setPassOpen(false);
                                setFetchData((pre: any) => !pre);
                                let successMessage = 'Đổi mật khẩu thành công';
                                toast.success(successMessage.trim(), {
                                    description: formattedDate,
                                    action: {
                                        label: "Undo",
                                        onClick: () => console.log("Undo"),
                                    },
                                });
                                console.log(res.data);
                            } else {
                                let errorMessage = 'Đổi mật khẩu thất bại';
                                toast.error(errorMessage.trim(), {
                                    description: formattedDate,
                                    action: {
                                        label: "Undo",
                                        onClick: () => console.log("Undo"),
                                    },
                                });
                                console.error(res.data.message);
                            }
                        }).catch(err => {
                            console.log('Error fetch data: ' + err);
                        })
                    } else {
                        let errorMessage = 'Đổi mật khẩu thất bại do mật khẩu mới không giống nhau';
                        toast.error(errorMessage.trim(), {
                            description: formattedDate,
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        });
                    }
                } else {
                    let errorMessage = 'Đổi mật khẩu thất bại do mật khẩu quá ngắn, ít nhất 8 ký tự';
                    toast.error(errorMessage.trim(), {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                }

            } else {
                let errorMessage = 'Đổi mật khẩu thất bại do mật khẩu hiện tại giống với mật khẩu mới';
                toast.error(errorMessage.trim(), {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
            }
        } else {
            let errorMessage = 'Đổi mật khẩu thất bại';
            toast.error(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
        }
    }

    // const handleGetToken = () =>{
    //     axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/auth/user/sendMail`,{
    //         name: adminname,
    //         email: forgetEmail
    //     }).then(res =>{
    //         if(res.data){
    //             Cookies.set("verifyCode", res.data, { expires: 1 / 288 });
    //             console.log(res.data);
    //         }

    //     }).catch(err =>{
    //         console.log('Error fetch data: ' + err);
    //     })
    // }

    return (
        <div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <FontAwesomeIcon
                        onClick={toggleShowModal}
                        className="text-[#777] text-[1.25rem] cursor-pointer"
                        icon={faBell} />
                    {showBadge && newOrder.filter((item: any) => item.isseen === "False").length > 0 && (
                        <div className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-[0.75rem] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {newOrder.filter((item: any) => item.isseen === "False").length}
                        </div>
                    )}
                </div>
                <Image width={30} height={30} alt="Image Admin" className="w-[30px] h-[30px] rounded-[50%] object-cover cursor-pointer" src={admin.adminpath} onClick={toggleOpenProfile} />
            </div>
            {showModal && (
                <div
                    className={`absolute right-20 top-16 mt-2 w-[400px] bg-white shadow-lg rounded-lg p-3 z-10 transition-all ease-in-out duration-500 transform ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                >
                    <div className="flex justify-between mt-1 mb-2">
                        <div className="text-[1rem] font-semibold italic">
                            Thông báo mới
                        </div>
                        <div></div>
                    </div>
                    <div className="w-full h-[485px] pr-2 overflow-y-auto custom-scrollbar">
                        {newOrder.map((item: any) => (
                            <div key={item.orderid} onClick={() => handleEditStatus(item.orderid)} className={`${item.isseen == 'True' ? `bg-white` : `bg-gray-300`} flex mt-3 w-full h-[85px] py-2 px-3 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer`}>
                                <div className="w-[20%]">
                                    <Image className="w-[70px] h-[70px] rounded-[50%]"
                                        src={item.user.userpath}
                                        width={60}
                                        height={60}
                                        alt={item.user.username}
                                    />
                                </div>
                                <div className="w-[80%] px-2">
                                    <div>Đơn hàng mới từ <span className="font-semibold">{item.user.username}</span> với mã đơn <FontAwesomeIcon className="text-[.8rem]" icon={faQrcode} /> <span className="text-[.8rem] font-bold">{item.ordercode}</span>.</div>
                                    <div className="text-[.8rem] font-semibold text-[#f8b602] mt-1">
                                        {formatDistanceToNow(parseISO(item.orderdate), { addSuffix: true, locale: vi })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {openProfile && (
                <div
                    className="absolute right-10 top-16 mt-2 w-[220px] bg-white shadow-lg rounded-lg py-3 px-5 z-10 transition-all ease-in-out duration-500 transform opacity-100 scale-100"
                >
                    <div className="flex items-center">
                        <div className="w-[30%]">
                            <Image className="w-[50px] h-[50px] rounded-[50%]" src={admin.adminpath} width={50} height={50} alt="Image Admin" />
                        </div>
                        <div className="w-[60%] ml-[5%]">
                            <div className="font-semibold">
                                {adminname}
                            </div>
                            <div className="text-[.7rem] mt-1">
                                {admin.email}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 border-b-[1px] border-solid border-[#ddd]"></div>
                    <div onClick={handleSetting} className="mt-2 text-[.9rem] text-[#3c3c3c] hover:text-black cursor-pointer py-1">
                        Cài đặt
                    </div>
                    <div
                        onClick={handleLogout}
                        className="mt-2 text-[.9rem] text-[#3c3c3c] hover:text-black cursor-pointer py-1">
                        Đăng xuất
                    </div>
                </div>
            )}
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
            {settingOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer overflow-y-auto" onClick={() => setEditStatus(false)}>
                    <div className="bg-[#edf6fe] w-full h-full p-6 shadow-lg z-60 relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex px-28">
                            <div className="w-[35%] h-[500px] mt-5 pr-10">
                                <p className="text-3xl font-bold">Planners<span className="text-[#f8b602]">.</span></p>
                                <p className="mt-5 text-[1.4rem] font-semibold">Cài đặt tài khoản</p>
                                <p className="mt-2 text-[#3c3c3c]">Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt bảo mật, quản lý thông báo, v.v.</p>
                                <div className="mt-8 space-y-1">
                                    <div
                                        className={`py-3 px-4 font-semibold rounded-lg cursor-pointer ${activeTab === "personalInfo"
                                            ? "bg-[#344854] text-white"
                                            : "bg-transparent text-black hover:bg-gray-300"
                                            }`}
                                        onClick={() => {
                                            setActiveTab("personalInfo");
                                            handleInfo();
                                        }}
                                    >
                                        <FontAwesomeIcon className="mr-2" icon={faUser} /> Thông tin cá nhân
                                    </div>

                                    <div
                                        className={`py-3 px-4 font-semibold rounded-lg cursor-pointer ${activeTab === "security"
                                            ? "bg-[#344854] text-white"
                                            : "bg-transparent text-black hover:bg-gray-300"
                                            }`}
                                        onClick={() => {
                                            setActiveTab("security");
                                            handlePass();
                                        }}
                                    >
                                        <FontAwesomeIcon className="mr-2" icon={faShield} /> Mật khẩu và bảo mật
                                    </div>
                                </div>
                            </div>
                            <div className="w-[65%] h-[500px] mt-[56px]">
                                {myInfo && (
                                    <div>
                                        <p className="mt-5 text-[1.4rem] font-semibold">Thông tin cá nhân</p>
                                        <p className="mt-2">Quản lý thông tin cá nhân của bạn.</p>
                                        <p className="mt-6 text-[1.1rem] font-semibold">Thông tin cơ bản</p>
                                        <div className="w-full h-[315px] mt-4 bg-white rounded-md shadow-md">
                                            <div
                                                onClick={() => setNameOpen(true)}
                                                className="w-full h-[70px] py-[10px] px-4 border-b-[1px] border-solid border-[#ccc] hover:bg-gray-200 transition-colors duration-200 hover:rounded-t-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">Họ và tên</p>
                                                        <p>{admin.adminname}</p>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faAngleRight} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setGenderOpen(true)}
                                                className="w-full h-[70px] py-[10px] px-4 border-b-[1px] border-solid border-[#ccc] hover:bg-gray-200 transition-colors duration-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">Giới tính</p>
                                                        <p>{admin.gender === "Male" ? 'Nam' : admin.gender === "Female" ? 'Nữ' : 'Khác'}</p>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faAngleRight} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                onClick={(e) => setBirthdayOpen(true)}
                                                className="w-full h-[70px] py-[10px] px-4 border-b-[1px] border-solid border-[#ccc] hover:bg-gray-200 transition-colors duration-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">Ngày sinh</p>
                                                        <p>{admin.birthday
                                                            ? format(new Date(admin.birthday), "EEEE, 'ngày' dd 'tháng' MM 'năm' yyyy", {
                                                                locale: vi,
                                                            })
                                                            : "Chưa có thông tin ngày sinh"}</p>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faAngleRight} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                onClick={(e) => setAvatarOpen(true)}
                                                className="w-full h-[105px] py-[10px] px-4 hover:bg-gray-200 transition-colors duration-200 rounded-b-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">Ảnh đại diện</p>
                                                        <Image width={30} height={30} alt="Image Admin" className="w-[50px] h-[50px] rounded-[50%] object-cover cursor-pointer my-2" src={admin.adminpath} />
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faAngleRight} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {myPass && (
                                    <div>
                                        <p className="mt-5 text-[1.4rem] font-semibold">Mật khẩu và bảo mật</p>
                                        <p className="mt-2">Quản lý mật khẩu cá nhân của bạn.</p>
                                        <p className="mt-6 text-[1.1rem] font-semibold">Đăng nhập và khôi phục</p>
                                        <div className="w-full h-full mt-4 bg-white rounded-md shadow-md">
                                            <div
                                                onClick={(e) => setPassOpen(true)}
                                                className="w-full h-[70px] py-[10px] px-4 hover:bg-gray-200 transition-colors duration-200 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">Đổi mật khẩu</p>
                                                        <p>Chưa đổi mật khẩu</p>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faAngleRight} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="absolute right-10 top-10" onClick={() => setSettingOpen(false)}>
                        <FontAwesomeIcon className="text-[2.5rem] text-[#ccc] hover:text-[#777] transition-colors duration-200" icon={faXmarkCircle} />
                    </div>
                </div>
            )}
            {nameOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
                    <div className="bg-white w-[420px] h-[360px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div onClick={() => setNameOpen(false)}>
                                    <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                                </div>
                            </div>
                            <div className="text-[1.2rem] font-semibold">
                                Cập nhật tên của bạn
                            </div>
                            <div className="mt-2">
                                Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.
                            </div>
                            <div className="mt-3">
                                <label className="ml-2 text-[.9rem] font-semibold">Họ và tên</label>
                                <input
                                    type="text"
                                    placeholder="Nhập họ và tên..."
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
                            </div>
                            <div
                                onClick={handleChangeName}
                                className="w-full font-semibold text-white text-center mt-14 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl  bg-custom-gradient focus:outline-[#1dbfaf]">
                                Lưu thay đổi
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {genderOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
                    <div className="bg-white w-[420px] h-[360px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div onClick={() => setGenderOpen(false)}>
                                    <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                                </div>
                            </div>
                            <div className="text-[1.2rem] font-semibold">
                                Cập nhật giới tính của bạn
                            </div>
                            <div className="mt-2">
                                Giới tính sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.
                            </div>
                            <div className="mt-3">
                                <label className="ml-2 text-[.9rem] font-semibold">Họ và tên</label>
                                <select value={editGender} onChange={(e) => setEditGender(e.target.value)} className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]">
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </select>
                            </div>
                            <div
                                onClick={handleChangeGender}
                                className="w-full font-semibold text-white text-center mt-14 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl  bg-custom-gradient focus:outline-[#1dbfaf]">
                                Lưu thay đổi
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {birthdayOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
                    <div className="bg-white w-[420px] h-[360px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div onClick={() => setBirthdayOpen(false)}>
                                    <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                                </div>
                            </div>
                            <div className="text-[1.2rem] font-semibold">
                                Cập nhật ngày sinh của bạn
                            </div>
                            <div className="mt-2">
                                Ngày sinh sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.
                            </div>
                            <div className="mt-3">
                                <label className="ml-2 text-[.9rem] font-semibold">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={editBirthday}
                                    onChange={(e) => setEditBirthday(e.target.value)}
                                    className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
                            </div>
                            <div
                                onClick={handleChangeBirthday}
                                className="w-full font-semibold text-white text-center mt-14 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl  bg-custom-gradient focus:outline-[#1dbfaf]">
                                Lưu thay đổi
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {avatarOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
                    <div className="bg-white after:bg-custom after:bg-custom-size after:bg-position-custom w-[420px] h-[460px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div onClick={() => setAvatarOpen(false)}>
                                    <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                                </div>
                            </div>
                            <div className="text-[1.2rem] font-semibold">
                                Cập nhật ảnh đại diện
                            </div>
                            <div className="mt-2">
                                Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các bài viết, bình luận, tin nhắn...
                            </div>
                            <div className="mt-5 text-center">
                                {editImage ? (
                                    <Image
                                        loading="lazy"
                                        className="w-[180px] h-[180px] rounded-[50%] inline-block"
                                        width={180}
                                        height={180}
                                        alt="Preview Avatar"
                                        src={editImage}
                                    />
                                ) : (
                                    <Image
                                        loading="lazy"
                                        className="w-[180px] h-[180px] rounded-[50%] inline-block"
                                        width={180}
                                        height={180}
                                        alt="Preview Avatar"
                                        src={admin.adminpath}
                                    />
                                )}
                            </div>

                            <div className="mt-10">
                                {editImage ? (
                                    <div
                                        onClick={handleChangeAvatar}
                                        className="w-full font-semibold text-white text-center py-3 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl bg-custom-gradient focus:outline-[#1dbfaf] cursor-pointer"
                                    >
                                        Lưu thay đổi
                                    </div>
                                ) : (
                                    <div
                                        className="w-full py-3 px-4 bg-slate-100 rounded-lg hover:bg-gray-200 cursor-pointer text-center"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FontAwesomeIcon className="mr-3" icon={faPlus} />
                                        Tải ảnh mới lên
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleChangeFile}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {passOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
                    <div className="bg-white w-[420px] h-[550px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <div className="flex items-center justify-between">
                                <div></div>
                                <div onClick={() => setPassOpen(false)}>
                                    <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                                </div>
                            </div>
                            <div className="text-[1.2rem] font-semibold">
                                Đổi mật khẩu
                            </div>
                            <div className="mt-2">
                                Mật khẩu của bạn phải có tối thiểu 8 ký tự.
                            </div>
                            <div className="mt-3">
                                <label className="ml-2 text-[.9rem] font-semibold">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu hiện tại của bạn"
                                    onChange={(e) => setEditOldPass(e.target.value)}
                                    className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
                            </div>
                            <div className="mt-5">
                                <label className="ml-2 text-[.9rem] font-semibold">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu mới của bạn"
                                    onChange={(e) => setEditNewPass(e.target.value)}
                                    className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
                            </div>
                            <div className="mt-5">
                                <label className="ml-2 text-[.9rem] font-semibold">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu mới của bạn"
                                    onChange={(e) => setEditConfirmPass(e.target.value)}
                                    className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
                            </div>
                            <div
                                onClick={handleChangePassword}
                                className="w-full font-semibold text-white text-center mt-14 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl  bg-custom-gradient focus:outline-[#1dbfaf]">
                                Đổi mật khẩu
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    )
}

export default Information;