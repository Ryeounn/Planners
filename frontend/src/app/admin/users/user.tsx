'use client';

import { useEffect, useState } from "react";
import Information from "../layout/info";
import Swal from "sweetalert2";
import { checkAuth } from "@/app/auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faCalendarDay, faEnvelope, faGlobe, faLocationDot, faMapLocationDot, faPhone, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";

const ManageUser = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [user, setUser] = useState<any>([]);
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [file, setFile] = useState<any>('');
    const [selectedCountry, setSelectedCountry] = useState("");
    const [keyword, setKeyword] = useState<any>('');

    const [createName, setCreateName] = useState<any>('');
    const [createEmail, setCreateEmail] = useState<any>('');
    const [createPass, setCreatePass] = useState<any>('');
    const [createBirthday, setCreateBirthday] = useState<any>('');
    const [createGender, setCreateGender] = useState<any>('');
    const [createPath, setCreatePath] = useState<any>('');
    const [createCity, setCreateCity] = useState<any>('');
    const [createNation, setCreateNation] = useState<any>('');
    const [createAddress, setCreateAddress] = useState<any>('');
    const [createPhone, setCreatePhone] = useState<any>('');

    const [editId, setEditId] = useState<any>('');
    const [editName, setEditName] = useState<any>('');
    const [editEmail, setEditEmail] = useState<any>('');
    const [editPass, setEditPass] = useState<any>('');
    const [editBirthday, setEditBirthday] = useState<any>('');
    const [editGender, setEditGender] = useState<any>('');
    const [editPath, setEditPath] = useState<any>('');
    const [editCity, setEditCity] = useState<any>('');
    const [editNation, setEditNation] = useState<any>('');
    const [editAddress, setEditAddress] = useState<any>('');
    const [editPhone, setEditPhone] = useState<any>('');

    const [nation, setNation] = useState<any>([]);
    const [city, setCity] = useState<any>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = currentPage === 1 ? 0 : indexOfLastItem - itemsPerPage;
    const currentUsers = currentPage === 1
        ? user.slice(indexOfFirstItem, indexOfFirstItem + 7)
        : user.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(user.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

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
        axios.get(`https://countriesnow.space/api/v0.1/countries`)
            .then(res => {
                console.log(res.data);
                if (res.data && Array.isArray(res.data.data)) {
                    const countries = res.data.data.map((item: any) => item.country);
                    setNation(res.data.data);
                    console.log(countries);
                } else {
                    console.error("Data format is incorrect or not an array.");
                }
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }, []);

    useEffect(() => {
        if (keyword) {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/findByEmail`, {
                keyword
            }).then(res => {
                setUser(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        } else {
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/findAllUser`)
                .then(res => {
                    setUser(res.data);
                    console.log(res.data);
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        }

    }, [keyword]);

    const fetchData = () => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/findAllUser`)
            .then(res => {
                setUser(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCloseCreateOpen = () => setCreateOpen(false);
    const handleEditOpen = (userid: number) => {
        setEditOpen(true);
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/findByUserId`, {
            id: userid
        }).then(res => {
            setEditName(res.data.username);
            setEditEmail(res.data.email);
            setEditBirthday(res.data.birthday);
            setEditGender(res.data.gender);
            setEditPhone(res.data.phone);
            setEditPass(res.data.pass);
            setEditNation(res.data.nation);
            setEditCity(res.data.city);
            setEditAddress(res.data.addr);
            setEditPath(res.data.userpath);
            setEditId(res.data.userid);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }
    const handleCloseEditOpen = () => setEditOpen(false);

    const handleEditFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEditPath(previewUrl);
            setFile({ file: file, fileName: file.name, type: 'image' });
        }
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

    const handleCountryChange = (e: any) => {
        const country = e.target.value;
        setSelectedCountry(country);

        const selectedNation = nation.find((item: any) => item.country === country);
        if (selectedNation) {
            setCreateNation(country);
            setCity(selectedNation.cities);
        } else {
            setCity([]);
        }
    };

    const handleEditUser = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let errorMessage = '';

        if (!editName) {
            errorMessage += 'Tên người dùng không được trống\n';
        }

        if (!editEmail) {
            errorMessage += 'Địa chỉ Email không được trống\n';
        } else if (!emailPattern.test(editEmail)) {
            errorMessage += 'Email không đúng định dạng. Ví dụ: abc@gmail.com.\n';
        }

        if (!editBirthday) {
            errorMessage += 'Ngày sinh không được trống\n';
        }

        if (!editGender) {
            errorMessage += 'Giới tính không được trống\n';
        }

        if (!editPhone) {
            errorMessage += 'Số điện thoại không được trống\n';
        }

        if (!editPass) {
            errorMessage += 'Mật khẩu không được trống\n';
        } else if (editPass.length < 8) {
            errorMessage += 'Mật khẩu phải có ít nhất 8 ký tự.\n';
        }

        if (!editNation) {
            errorMessage += 'Quốc gia không được trống\n';
        }

        if (!editCity) {
            errorMessage += 'Thành phố không được trống\n';
        }

        if (!editAddress) {
            errorMessage += 'Địa chỉ không được trống\n';
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

        let result = '';
        if (file && file.file) {
            result = await handleUpload(file.file);
        } else {
            result = editPath;
        }

        const editData = {
            username: editName,
            email: editEmail,
            birthday: editBirthday,
            gender: editGender,
            phone: editPhone,
            nation: editNation,
            city: editCity,
            addr: editAddress,
            userpath: result,
            userid: editId
        }

        await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/update`, editData)
            .then(res => {
                const successMessage = 'Updated User successfully';
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
    }

    const handleDeleteUser = async (userid: number) => {
        Swal.fire({
            title: 'Bạn chắc chắn chứ?',
            text: "Bạn sẽ không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa chuyến đi!',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/delete`, {
                    userid: userid
                }).then(res => {
                    const currentDate = new Date();
                    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                    fetchData();
                    const successMessage = 'Deleted Tour successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setEditOpen(false);
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

    const handleCreateUser = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let errorMessage = '';

        if (!createName) {
            errorMessage += 'Tên người dùng không được trống\n';
        }

        if (!createEmail) {
            errorMessage += 'Địa chỉ Email không được trống\n';
        } else if (!emailPattern.test(createEmail)) {
            errorMessage += 'Email không đúng định dạng. Ví dụ: abc@gmail.com.\n';
        }

        if (!createBirthday) {
            errorMessage += 'Ngày sinh không được trống\n';
        }

        if (!createGender) {
            errorMessage += 'Giới tính không được trống\n';
        }

        if (!createPhone) {
            errorMessage += 'Số điện thoại không được trống\n';
        }

        if (!createPass) {
            errorMessage += 'Mật khẩu không được trống\n';
        } else if (createPass.length < 8) {
            errorMessage += 'Mật khẩu phải có ít nhất 8 ký tự.\n';
        }

        if (!createNation) {
            errorMessage += 'Quốc gia không được trống\n';
        }

        if (!createCity) {
            errorMessage += 'Thành phố không được trống\n';
        }

        if (!createAddress) {
            errorMessage += 'Địa chỉ không được trống\n';
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
            username: createName,
            email: createEmail,
            birthday: createBirthday,
            gender: createGender,
            phone: createPhone,
            pass: createPass,
            nation: createNation,
            city: createCity,
            addr: createAddress,
            userpath: "/assets/images/users/default.png",
            created: new Date()
        }

        await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/create`, createData)
            .then(res => {
                if (res.data.success) {
                    const successMessage = 'Sign up successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setCreateName('');
                    setCreateEmail('');
                    setCreateBirthday('');
                    setCreateGender('');
                    setCreatePhone('');
                    setCreatePass('');
                    setCreateNation('');
                    setCreateCity('');
                    setCreateAddress('');
                    setCreatePath('');
                    fetchData();
                    setCreateOpen(false);
                    console.log(res.data);
                } else {
                    const errorMessage = 'Create user failed: Account already exists';
                    toast.error(errorMessage, {
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

    return (
        <div>
            <div className={isAuthenticated ? '' : 'blurred-content'}>
                <div className="mx-10">
                    <div className="flex items-center justify-between">
                        <p className="text-[1.2rem] font-sans font-semibold">Người dùng</p>
                        <div className="w-[35%] flex items-center justify-around">
                            <input
                                type="text"
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Nhập địa chỉ email người dùng..."
                                className="w-[75%] mr-3 py-1 px-3 border-[1px] border-solid border-[#ccc] focus:outline-none rounded-md" />
                            <Information />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-10 mt-8">
                        {currentPage === 1 && (
                            <div
                                onClick={handleCreateOpen}
                                className="w-full h-[400px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                                <div className="w-[calc(100%-10%)] mt-5 mx-[5%] h-[250px] bg-[#ccc] rounded-lg">
                                    <div className="flex items-center justify-center">
                                        <FontAwesomeIcon className="text-[50px] relative top-24 text-white" icon={faPlus} />
                                    </div>
                                </div>
                                <p className="mt-5 text-[20px] font-semibold text-center">Người dùng mới</p>
                            </div>
                        )}
                        {currentUsers.map((item: any) => (
                            <div
                                onClick={() => handleEditOpen(item.userid)}
                                key={item.userid}
                                className="w-full h-[400px] bg-white border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                                <div className={`w-[calc(100%-10%)] mt-5 mx-[5%] h-[150px] bg-[#ccc] rounded-lg relative`}>
                                    <img src={item.userpath} alt="User Image" className="w-full h-full object-cover object-center rounded-lg" />
                                </div>
                                <p className="mt-2 mx-[5%] text-center text-[1.125rem] font-medium">{item.username}</p>
                                <p className="text-center mx-[5%] italic font-semibold text-[.75rem] mb-3"><FontAwesomeIcon className="mr-2" icon={faEnvelope} />{item.email}</p>
                                <p className="text-[.75rem] text-center mx-[5%]">{item.descrip}</p>
                                <div>
                                    <div className="mt-2 mx-[5%] space-x-1 flex items-center justify-center text-center">
                                        <div className="w-[30%]">
                                            <p>
                                                <FontAwesomeIcon icon={faPhone} />
                                            </p>
                                            <p>
                                                <FontAwesomeIcon icon={faCalendarDay} />
                                            </p>
                                            <p>
                                                <FontAwesomeIcon icon={faUser} />
                                            </p>
                                            <p>
                                                <FontAwesomeIcon icon={faMapLocationDot} />
                                            </p>
                                        </div>
                                        <div className="w-[70%]">
                                            <p className="text-left">{item.phone}</p>
                                            <p className="text-left">{item.birthday}</p>
                                            <p className="text-left">{item.gender}</p>
                                            <p className="text-left">{item.addr}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mx-5 mt-5">
                                        <div>
                                            <span className="text-[.8rem]"><FontAwesomeIcon className="mr-2" icon={faLocationDot} />{item.city}</span>
                                        </div>
                                        <div>|</div>
                                        <div>
                                            <span className="text-[.8rem]"><FontAwesomeIcon className="mr-2" icon={faGlobe} />{item.nation}</span>
                                        </div>
                                    </div>
                                </div>
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
                    {createOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleCloseCreateOpen}>
                            <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl text-center font-semibold mb-2">Thêm người dùng mới mới</h2>
                                <div className="flex">
                                    <div className="w-[25%]">
                                        <p className="text-[1.25rem] my-3 font-semibold">Thông tin người dùng</p>
                                        <div className="mt-3">
                                            <label>Họ và tên</label>
                                            <input type="text"
                                                onChange={(e) => setCreateName(e.target.value)}
                                                placeholder="Nhập họ và tên..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Địa chỉ E-mail</label>
                                            <input type="text"
                                                onChange={(e) => setCreateEmail(e.target.value)}
                                                placeholder="Nhập email..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Ngày sinh</label>
                                            <input type="date"
                                                onChange={(e) => setCreateBirthday(e.target.value)}
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Giới tính</label>
                                            <select onChange={(e) => setCreateGender(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                                <option value="">Chọn giới tính</option>
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Unknown">Không xác định</option>
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setCreatePhone(e.target.value)}
                                                placeholder="Nhập số điện thoại..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                onChange={(e) => setCreatePass(e.target.value)}
                                                placeholder="Nhập mật khẩu..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                    </div>
                                    <div className="w-[25%] mx-[5%]">
                                        <p className="text-[1.25rem] mt-4 font-semibold">Địa chỉ người dùng</p>
                                        <div className="mt-3">
                                            <label>Quốc gia</label>
                                            <select onChange={handleCountryChange} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                                <option value="">Chọn quốc gia</option>
                                                {nation.length > 0 ? (
                                                    nation.map((item: any, index: number) => (
                                                        <option key={index} value={item.country}>{item.country}</option>
                                                    ))
                                                ) : (
                                                    <p>sdasd</p>
                                                )}
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label>Thành phố</label>
                                            <select onChange={(e) => setCreateCity(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                                <option value="">Chọn thành phố</option>
                                                {city.length > 0 ? (
                                                    city.map((cityName: any, index: number) => (
                                                        <option key={index} value={cityName}>
                                                            {cityName}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option>Không có thành phố</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label>Địa chỉ</label>
                                            <input type="text"
                                                onChange={(e) => setCreateAddress(e.target.value)}
                                                placeholder="Nhập địa chỉ cụ thể..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                    </div>
                                    <div className="w-[32%] mx-[8%]">
                                        <p className="text-[1.25rem] my-3 font-semibold">Xem trước</p>
                                        <div className="w-100% relative mx-4 h-[550px] border-[1px] border-solid border-[#ccc] rounded-lg">
                                            <img className="px-4 pt-4 w-full object-cover h-[200px]" src="/assets/images/users/default.png" />
                                            {createName && (
                                                <p className="mt-1 text-[1.25rem] text-center font-bold">{createName}</p>
                                            )}
                                            {createEmail && (
                                                <p className="text-center italic text-[.9rem]"><FontAwesomeIcon className="mr-1" icon={faEnvelope} /> {createEmail}</p>
                                            )}
                                            {createBirthday && (
                                                <p className="w-100% mt-5 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faCalendarAlt} />Ngày sinh: {formatDate(createBirthday)}</p>
                                            )}
                                            {createGender && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faUser} />Giới tính: {createGender}</p>
                                            )}
                                            {createPhone && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faPhone} />Số điện thoại: {createPhone}</p>
                                            )}
                                            {createNation && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faGlobe} />Quốc gia: {createNation}</p>
                                            )}
                                            {createCity && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faLocationDot} />Thành phố: {createCity}</p>
                                            )}
                                            {createAddress && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faMapLocationDot} />Địa chỉ: {createAddress}</p>
                                            )}
                                        </div>
                                        <div className="flex mt-5 space-x-3">
                                            <button
                                                onClick={handleCloseCreateOpen}
                                                className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                            >
                                                Hủy bỏ
                                            </button>
                                            <button
                                                onClick={handleCreateUser}
                                                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                Tạo người dùng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {editOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleCloseEditOpen}>
                            <div className="bg-white w-full mx-32 p-6 rounded-lg shadow-lg z-60" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-xl text-center font-semibold mb-2">Thêm người dùng mới mới</h2>
                                <div className="flex">
                                    <div className="w-[25%]">
                                        <p className="text-[1.25rem] my-3 font-semibold">Thông tin người dùng</p>
                                        <div className="mt-3">
                                            <label>Hình ảnh chuyến du lịch</label>
                                            <input
                                                onChange={handleEditFileChange}
                                                type="file"
                                                accept='image/*'
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label>Họ và tên</label>
                                            <input type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                placeholder="Nhập họ và tên..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Địa chỉ E-mail</label>
                                            <input type="text"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                placeholder="Nhập email..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Ngày sinh</label>
                                            <input type="date"
                                                value={editBirthday}
                                                onChange={(e) => setEditBirthday(e.target.value)}
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                        <div className="mt-3">
                                            <label>Giới tính</label>
                                            <select value={editGender} onChange={(e) => setEditGender(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                                <option value="">Chọn giới tính</option>
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Unknown">Không xác định</option>
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label>Số điện thoại</label>
                                            <input
                                                type="text"
                                                value={editPhone}
                                                onChange={(e) => setEditPhone(e.target.value)}
                                                placeholder="Nhập số điện thoại..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                    </div>
                                    <div className="w-[25%] mx-[5%]">
                                        <p className="text-[1.25rem] mt-4 font-semibold">Địa chỉ người dùng</p>
                                        <div className="mt-3">
                                            <label>Quốc gia</label>
                                            <select value={editNation} onChange={handleCountryChange} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                                <option value="">Chọn quốc gia</option>
                                                {nation.length > 0 ? (
                                                    nation.map((item: any, index: number) => (
                                                        <option key={index} value={item.country}>{item.country}</option>
                                                    ))
                                                ) : (
                                                    <p>sdasd</p>
                                                )}
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label>Thành phố</label>
                                            <select value={editCity} onChange={(e) => setEditCity(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
                                                <option value="">Chọn thành phố</option>
                                                {city.length > 0 ? (
                                                    city.map((cityName: any, index: number) => (
                                                        <option key={index} value={cityName}>
                                                            {cityName}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option>Không có thành phố</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label>Địa chỉ</label>
                                            <input type="text"
                                                value={editAddress}
                                                onChange={(e) => setEditAddress(e.target.value)}
                                                placeholder="Nhập địa chỉ cụ thể..."
                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                        </div>
                                    </div>
                                    <div className="w-[32%] mx-[8%]">
                                        <p className="text-[1.25rem] my-3 font-semibold">Xem trước</p>
                                        <div className="w-100% relative mx-4 h-[550px] border-[1px] border-solid border-[#ccc] rounded-lg">
                                            {editPath && (
                                                <img className="px-4 pt-4 w-full object-cover h-[200px]" src={editPath} />
                                            )}
                                            {editName && (
                                                <p className="mt-1 text-[1.25rem] text-center font-bold">{editName}</p>
                                            )}
                                            {editEmail && (
                                                <p className="text-center italic text-[.9rem]"><FontAwesomeIcon className="mr-1" icon={faEnvelope} /> {editEmail}</p>
                                            )}
                                            {editBirthday && (
                                                <p className="w-100% mt-5 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faCalendarAlt} />Ngày sinh: {formatDate(editBirthday)}</p>
                                            )}
                                            {editGender && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faUser} />Giới tính: {editGender}</p>
                                            )}
                                            {editPhone && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faPhone} />Số điện thoại: {editPhone}</p>
                                            )}
                                            {editNation && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faGlobe} />Quốc gia: {editNation}</p>
                                            )}
                                            {editCity && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faLocationDot} />Thành phố: {editCity}</p>
                                            )}
                                            {editAddress && (
                                                <p className="w-100% mt-3 mx-4 break-words"><FontAwesomeIcon className="mr-2" icon={faMapLocationDot} />Địa chỉ: {editAddress}</p>
                                            )}
                                        </div>
                                        <div className="flex mt-5 space-x-3">
                                            <button
                                                onClick={handleCloseEditOpen}
                                                className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                            >
                                                Hủy bỏ
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(editId)}
                                                className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                            >
                                                Xóa
                                            </button>
                                            <button
                                                onClick={handleEditUser}
                                                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageUser;