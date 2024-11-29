'use client';
import { faArrowRight, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Profiler = () => {
    const [changePassword, setChangePassword] = useState<boolean>(false);
    const [changeAvatar, setChangeAvatar] = useState<boolean>(false);
    const [userId, setUserId] = useState<any>('');
    const [profile, setProfile] = useState<any>([]);
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [birthday, setBirthday] = useState<any>('');
    const [city, setCity] = useState<string>('');
    const [nation, setNation] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [avt, setAvt] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [file, setFile] = useState<any>('');
    const [imagePreview, setImagePreview] = useState<any>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userid = sessionStorage.getItem('user');
            setUserId(userid);
        }
    }, [userId])

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/getUserCheckOut`, {
            id: userId
        }).then(res => {
            console.log(res.data);
            setProfile(res.data);
            setName(res.data.username);
            setPassword(res.data.pass);
            setEmail(res.data.email);
            setGender(res.data.gender);
            setBirthday(res.data.birthday);
            setCity(res.data.city);
            setNation(res.data.nation);
            setAddress(res.data.addr);
            setAvt(res.data.userpath);
            setPhone(res.data.phone);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [userId])

    const handleOpenModal = () => {
        setChangePassword(true);
    };

    const handleCloseModal = () => {
        setChangePassword(false);
    };

    const handleOpenModalAvatar = () => {
        setChangeAvatar(true);
    };

    const handleCloseModalAvatar = () => {
        setChangeAvatar(false);
    };

    const handleChangePassword = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';

        if (!newPass) {
            errorMessage += 'New Password cannot be blank.\n';
        } else if (newPass.length < 8) {
            errorMessage += 'New Password must be at least 8 characters.\n';
        }

        if (!confirmPass) {
            errorMessage += 'Confirm Password cannot be blank.\n';
        } else if (confirmPass.length < 8) {
            errorMessage += 'New Password must be at least 8 characters.\n';
        }

        if (newPass !== confirmPass) {
            errorMessage += 'Password and Confirm Password do not match.\n';
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


        const changeData = {
            userId: userId,
            password: newPass
        }

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/updatePassword`, changeData)
            .then(res => {
                if (res.data.success) {
                    const successMessage = 'Update Password successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setChangePassword(false);
                } else {
                    const failMessage = 'Update Password fail';
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

    const handleChangeInfo = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let errorMessage = '';

        if (!name) {
            errorMessage += 'Name cannot be blank.\n';
        }

        if (!email) {
            errorMessage += 'Email cannot be blank.\n';
        } else if (!emailPattern.test(email)) {
            errorMessage += 'Email is not in correct format. Example: abc@gmail.com.\n';
        }

        if (!phone) {
            errorMessage += 'Confirm Password cannot be blank.\n';
        } else if (phone.length != 10) {
            errorMessage += 'Phone number must be 10 digits.\n';
        }

        if (!gender) {
            errorMessage += 'Gender cannot be blank.\n';
        }

        if (!birthday) {
            errorMessage += 'Name cannot be blank.\n';
        }

        if (!city) {
            errorMessage += 'City cannot be blank.\n';
        }

        if (!nation) {
            errorMessage += 'Nation cannot be blank.\n';
        }

        if (!address) {
            errorMessage += 'Address cannot be blank.\n';
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

        const changeData = {
            userId: userId,
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            birthday: birthday,
            city: city,
            nation: nation,
            address: address
        }

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/updateProfile`, changeData)
            .then(res => {
                if (res.data.success) {
                    const successMessage = 'Update Profile successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                } else {
                    const failMessage = 'Update Profile fail';
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

    const handleImageChange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            setFile({ file: file, fileName: file.name, type: 'image' });
        }
    }

    const handleImage = async (e: any) => {
        e.preventDefault();
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        if (file && file.file) {
            const result = await handleUpload(file.file);

            const changeData = {
                userId: userId,
                avatar: result
            }

            await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/updateAvatar`, changeData)
                .then(res => {
                    const successMessage = 'Update Avatar successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setAvt(result);
                    setChangeAvatar(false);
                    
                }).catch(err => {
                    const successMessage = 'Update Avatar fail';
                    toast.error(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                })
            console.log(result);
        } else {
            const successMessage = 'Update Avatar fail';
            toast.error(successMessage, {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
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

    return (
        <div>
            <div className="w-full h-[580px] pt-5 border-[1px] border-solid border-[#dfdfdf] rounded-lg shadow-lg">
                <form>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <div className="text-center">
                                <img className="w-[100px] h-[100px] rounded-[50%] inline-block relative" src={avt} />
                                <FontAwesomeIcon onClick={handleOpenModalAvatar} className="absolute text-[#0B8494] top-[75px] right-[290px] bg-white border-[1px] border-solid border-[#dfdfdf] p-[6px] rounded-[50%] cursor-pointer" icon={faCamera} />
                            </div>
                            <div className="w-[70%] mx-[15%] mt-5">
                                <div>
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Name..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                    />
                                </div>
                                <div className="mt-5">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Password..."
                                        value={password}
                                        readOnly
                                        className="mt-2 pr-48 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none transition-all duration-300 relative"
                                    />
                                    <div
                                        onClick={handleOpenModal}
                                        className="absolute top-[244px] right-[110px] py-1 px-2 rounded-md bg-white text-green-500 uppercase font-semibold cursor-pointer hover:bg-[#f0f0f0fb]">Change Password</div>
                                </div>
                                <div className="mt-5">
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        placeholder="Email..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                    />
                                </div>
                                <div className="mt-5">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        placeholder="Phone..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-[70%] ml-[5%] mr-[25%]">
                            <div >
                                <label>Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none">
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            </div>
                            <div className="mt-5">
                                <label>Birthday</label>
                                <input
                                    type="date"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                />
                            </div>
                            <div className="mt-5">
                                <label>City</label>
                                <input
                                    type="text"
                                    placeholder="City..."
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                />
                            </div>
                            <div className="mt-5">
                                <label>Nation</label>
                                <input
                                    type="text"
                                    placeholder="Nation..."
                                    value={nation}
                                    onChange={(e) => setNation(e.target.value)}
                                    className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                />
                            </div>
                            <div className="mt-5">
                                <label>Address</label>
                                <input
                                    type="text"
                                    placeholder="Address..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-2 py-[6px] px-3 rounded-md w-full border-[1px] border-solid border-[#ccc] focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-5">
                        <div onClick={handleChangeInfo} className="w-fit py-2 px-6 flex items-center justify-between rounded-lg bg-[#0B8494] text-white cursor-pointer">
                            <span className="mr-4">Save change</span>
                            <FontAwesomeIcon className="py-2 px-2 rounded-[50%] bg-[#0B8499] shadow-xl" icon={faArrowRight} />
                        </div>
                    </div>
                </form>
                {changePassword && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-5 shadow-lg w-1/3">
                            <h2 className="text-lg text-center font-bold mb-4">Change Password</h2>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className="mt-2 py-2 px-3 rounded-md w-full border border-solid border-[#ccc] focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="mt-2 py-2 px-3 rounded-md w-full border border-solid border-[#ccc] focus:outline-none"
                            />
                            <div className="flex justify-center mt-4">
                                <button
                                    className="bg-[#0B8494] text-white py-2 px-4 rounded-lg mr-2 cursor-pointer"
                                    onClick={handleChangePassword}
                                >
                                    Save change
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 text-black py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {changeAvatar && (
                    <form encType="multipart/formdata">
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-5 shadow-lg w-1/3">
                                <h2 className="text-lg text-center font-bold mb-4">Change Avatar</h2>
                                <div className="text-center">
                                    {imagePreview ? (
                                        <img className="border-[1px] border-solid border-[#ccc] rounded-[50%] inline-block" alt={imagePreview} src={imagePreview} width={400} height={800} />
                                    ) : (
                                        <img className="border-[1px] border-solid border-[#ccc] rounded-[50%] inline-block" alt={avt} src={avt} width={400} height={800} />
                                    )}
                                    <input
                                        onChange={handleImageChange}
                                        type="file"
                                        className="my-5"
                                        accept='image/*' />
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        className="bg-[#0B8494] text-white py-2 px-4 rounded-lg mr-2 cursor-pointer"
                                        onClick={handleImage}
                                    >
                                        Save change
                                    </button>
                                    <button
                                        onClick={handleCloseModalAvatar}
                                        className="bg-gray-300 text-black py-2 px-4 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Profiler;