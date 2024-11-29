"use client";
import { faBaby, faCalendarDays, faChild, faPlaneDeparture, faQrcode, faSackDollar, faMoneyBill, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "./header";
import GoogleLoginButton from "../lib/GoogleLoginButton";
import Link from "next/link";
import PayPalButton from "./paypal";

interface CustomerInfo {
    fullName: string;
    email: string;
    passport: string;
    phone: string;
    address: string;
    nation: string;
}

const Check = () => {
    const [userid, setUserId] = useState<any>('');
    const [user, setUser] = useState<any>('');
    const [tourid, setTourid] = useState<number | null>(null);
    const [tour, setTour] = useState<any>([]);
    const [adult, setAdult] = useState<any>(0);
    const [children, setChildren] = useState<any>(0);
    const [baby, setBaby] = useState<any>(0);
    const [priceAdult, setPriceAdult] = useState<number>(0);
    const [priceChildren, setPriceChildren] = useState<number>(0);
    const [priceBaby, setPriceBaby] = useState<number>(0);
    const [adultsData, setAdultsData] = useState<CustomerInfo[]>(Array(adult).fill({ fullName: "", email: "", passport: "", phone: "", address: "", nation: "" }));
    const [childrenData, setChildrenData] = useState<CustomerInfo[]>(Array(children).fill({ fullName: "", email: "", passport: "", phone: "", address: "", nation: "" }));
    const [babiesData, setBabiesData] = useState<CustomerInfo[]>(Array(baby).fill({ fullName: "", email: "", passport: "", phone: "", address: "", nation: "" }));
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [totalQuantity, setTotalQuantity] = useState<any>(0);
    const [timeLeft, setTimeLeft] = useState(600);
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginFormVisible, setLoginFormVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [tourslug, setTourslug] = useState<string>('');
    const [isOrdered, setIsOrdered] = useState<boolean>(true);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userid');
        if (!storedUserId) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleSignIn = async () => {
        const loginData = {
            email: email,
            password: password
        }
        const res = await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/auth/login`, loginData);
        const result = await res.data;
        if (res) {
            console.log('JWT Token:', res.data.token);
            console.log('User Info:', res.data);
            console.log('User Info:', res.data.userid);
            sessionStorage.setItem('token', result.token);
            sessionStorage.setItem('user', result.data.userid);
            sessionStorage.setItem('name', result.data.username);
            sessionStorage.setItem('avatar', result.data.userpath);
            setLoginFormVisible(false);
        } else {
            console.log('Error fetch data');
        }
    }

    useEffect(() => {
        const userid = sessionStorage.getItem('userid');
        if (!userid) {
            setLoginFormVisible(true);
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTourid = sessionStorage.getItem('tourid');
            const storedTourname = sessionStorage.getItem('tourname');
            const storedAdult = sessionStorage.getItem('adult') || '';
            const storedChildren = sessionStorage.getItem('children') || '';
            const storedBaby = sessionStorage.getItem('baby') || '';
            const storedQuantity = sessionStorage.getItem('totalQuantity');

            const storedPriceAdult = parseFloat(sessionStorage.getItem('priceAdult') || '');
            const storedPriceChildren = parseFloat(sessionStorage.getItem('priceChildren') || '');
            const storedPriceBaby = parseFloat(sessionStorage.getItem('priceBaby') || '');
            const user = parseInt(sessionStorage.getItem('user') || '');

            if (storedTourid) {
                setTourid(parseInt(storedTourid));
            } else {
                setTourid(null);
            }

            if (storedTourname && storedTourid) {
                const links = `${storedTourname.replace(/\s+/g, '-')}-${storedTourid}`;
                setTourslug(`/travel/${links}`);
            } else {
                setTourslug('/tour');
            }

            if (storedAdult) {
                setAdult(parseInt(storedAdult));
                setPriceAdult(storedPriceAdult);
            } else {
                setAdult('');
                setPriceAdult(0);
            }

            if (storedChildren) {
                setChildren(parseInt(storedChildren));
                setPriceChildren(storedPriceChildren);
            } else {
                setChildren('');
                setPriceChildren(0);
            }

            if (storedBaby) {
                setBaby(parseInt(storedBaby));
                setPriceBaby(storedPriceBaby);
            } else {
                setBaby('');
                setPriceBaby(0);
            }

            if (user) {
                setUserId(user);
            } else {
                setUserId('');
            }

            if (storedQuantity) {
                setTotalQuantity(parseInt(storedQuantity));
            } else {
                setTotalQuantity(parseInt(''));
            }

            if(storedTourname && storedTourid && storedQuantity){
                setIsOrdered(false);
            }
        }
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            sessionStorage.removeItem('tourid');
            sessionStorage.removeItem('tourname');
            sessionStorage.removeItem('totalQuantity');
            sessionStorage.removeItem('adult');
            sessionStorage.removeItem('children');
            sessionStorage.removeItem('baby');
            sessionStorage.removeItem('priceAdult');
            sessionStorage.removeItem('priceChildren');
            sessionStorage.removeItem('priceBaby');
            router.push(tourslug);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (time: any) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes} min ${seconds < 10 ? `0${seconds}  second` : seconds} second`;
    };

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/getUserCheckOut`, {
            id: userid
        }).then(res => {
            setUser(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [userid])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, role: string, field: keyof CustomerInfo) => {
        const value = e.target.value;

        if (role === "Adult") {
            setAdultsData(prevData => {
                const updatedData = [...prevData];
                if (!updatedData[index]) {
                    updatedData[index] = { fullName: "", email: "", passport: "", phone: "", address: "", nation: "" };
                }
                updatedData[index][field] = value;
                return updatedData;
            });
        } else if (role === "Children") {
            setChildrenData(prevData => {
                const updatedData = [...prevData];
                if (!updatedData[index]) {
                    updatedData[index] = { fullName: "", email: "", passport: "", phone: "", address: "", nation: "" };
                }
                updatedData[index][field] = value;
                return updatedData;
            });
        } else {
            setBabiesData(prevData => {
                const updatedData = [...prevData];
                if (!updatedData[index]) {
                    updatedData[index] = { fullName: "", email: "", passport: "", phone: "", address: "", nation: "" };
                }
                updatedData[index][field] = value;
                return updatedData;
            });
        }
    };

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/tour/getTourId`, {
            tour: tourid
        }).then(res => {
            setTour(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [tourid]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const renderForms = (count: number, role: string) => {
        return Array.from({ length: count }, (_, index) => (
            <div key={`${role}-${index}`} className="mb-10">
                <h3 className="font-semibold mb-3">{role} {index + 1}</h3>
                <div className="flex">
                    <div className="w-[45%] mr-[5%]">
                        <div className="mb-5">
                            <label>Full name <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                            <input
                                type="text"
                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md"
                                value={role === "Adult" ? adultsData[index]?.fullName : role === "Children" ? childrenData[index]?.fullName : babiesData[index]?.fullName}
                                onChange={(e) => handleInputChange(e, index, role, "fullName")}
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label>Email <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                            <input
                                type="text"
                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md"
                                value={role === "Adult" ? adultsData[index]?.email : role === "Children" ? childrenData[index]?.email : babiesData[index]?.email}
                                onChange={(e) => handleInputChange(e, index, role, "email")}
                            />
                        </div>
                        <div>
                            <label>Passport</label>
                            <input
                                type="text"
                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md"
                                value={role === "Adult" ? adultsData[index]?.passport : role === "Children" ? childrenData[index]?.passport : babiesData[index]?.passport}
                                onChange={(e) => handleInputChange(e, index, role, "passport")}
                            />
                        </div>
                    </div>
                    <div className="w-[45%] mr-[5%]">
                        <div className="mb-5">
                            <label>Phone <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                            <input
                                type="text"
                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md"
                                value={role === "Adult" ? adultsData[index]?.phone : role === "Children" ? childrenData[index]?.phone : babiesData[index]?.phone}
                                onChange={(e) => handleInputChange(e, index, role, "phone")}
                            />
                        </div>
                        <div className="mb-5">
                            <label>Address <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                            <input
                                type="text"
                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md"
                                value={role === "Adult" ? adultsData[index]?.address : role === "Children" ? childrenData[index]?.address : babiesData[index]?.address}
                                onChange={(e) => handleInputChange(e, index, role, "address")}
                            />
                        </div>
                        <div>
                            <label>Nation</label>
                            <input
                                type="text"
                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md"
                                value={role === "Adult" ? adultsData[index]?.nation : role === "Children" ? childrenData[index]?.nation : babiesData[index]?.nation}
                                onChange={(e) => handleInputChange(e, index, role, "nation")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    const handleSubmit = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");

        if (!selectedOption) {
            toast.error("You need to choose a payment method", {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }

        const requiredAdults = adult;
        const requiredChildren = children;
        const requiredBabies = baby;

        let errorMessage = '';

        if (requiredAdults && adultsData.length !== requiredAdults) {
            errorMessage += `You must enter information for ${requiredAdults} adults.\n`;
        } else if (requiredAdults && adultsData.some(data => !data.fullName || !data.email || !data.phone || !data.passport || !data.address || !data.nation)) {
            errorMessage += `Please fill in all fields for adults.\n`;
        }

        if (requiredChildren && childrenData.length !== requiredChildren) {
            errorMessage += `You must enter information for ${requiredChildren} children.\n`;
        } else if (requiredChildren && childrenData.some(data => !data.fullName || !data.email || !data.phone || !data.passport || !data.address || !data.nation)) {
            errorMessage += `Please fill in all fields for children.\n`;
        }

        if (requiredBabies && babiesData.length !== requiredBabies) {
            errorMessage += `You must enter information for ${requiredBabies} babyies.\n`;
        } else if (requiredBabies && babiesData.some(data => !data.fullName || !data.email || !data.phone || !data.passport || !data.address || !data.nation)) {
            errorMessage += `Please fill in all fields for babies.\n`;
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

        const payload = {
            adults: adultsData,
            children: childrenData,
            babies: babiesData,
            tour: tourid,
            userid: userid,
            totalquantity: totalQuantity,
            totalPrice: (adult * priceAdult) + (children * priceChildren) + (baby * priceBaby),
        };
        console.log(payload);

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/orders/createOrder`, payload)
            .then(res => {
                console.log(res.data);
                sessionStorage.removeItem('tourid');
                sessionStorage.removeItem('tourname');
                sessionStorage.removeItem('totalQuantity');
                sessionStorage.removeItem('adult');
                sessionStorage.removeItem('children');
                sessionStorage.removeItem('baby');
                sessionStorage.removeItem('priceAdult');
                sessionStorage.removeItem('priceChildren');
                sessionStorage.removeItem('priceBaby');
                toast.success("You have placed your order successfully! Please wait for confirmation from the administrator", {
                    description: formattedDate,
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                });
                setIsOrdered(true);
            })
            .catch(err => {
                console.log('Error Create Orders: ' + err);
            });
    };

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    const handleShowLogin = () => {
        setLoginFormVisible(pre => !pre);
    }

    return (
        <div>
            {userid ? (
                <div className="flex justify-center">
                    {isOrdered ? (
                        <div className="my-5">
                            <img className="w-full h-full" src="/assets/images/app/empty.jpg"/>
                            <p className="text-[18px] text-center">Do you want a great travel experience? <Link className="underline text-blue-500 hover:text-blue-700" href="/travel">Shop now</Link></p>
                        </div>
                    ) : (
                        <div className="flex justify-center w-full">
                        <div className="w-[55%]">
                            <div id="contact-info">
                                <p className="text-[1.6rem] uppercase font-semibold mb-3">Contact Information</p>
                                <div className="flex">
                                    <div className="w-[45%] mr-[5%]">
                                        <div className="mb-5">
                                            <label>Full name <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md bg-[#d2d2d2]"
                                                value={user.username}
                                                readOnly
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label>Email <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md bg-[#d2d2d2]"
                                                value={user.email}
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label>City</label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md bg-[#d2d2d2]"
                                                value={user.city}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="w-[45%] mr-[5%]">
                                        <div className="mb-5">
                                            <label>Phone <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md bg-[#d2d2d2]"
                                                value={user.phone}
                                                readOnly
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label>Address <sup className="text-[18px] text-[rgb(230,0,18)]">*</sup></label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md bg-[#d2d2d2]"
                                                value={user.addr}
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label>Nation</label>
                                            <input
                                                type="text"
                                                className="w-full border-2 border-solid border-[#ccc] focus:outline-none py-1 px-2 mt-2 rounded-md bg-[#d2d2d2]"
                                                value={user.nation}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="customer-info" className="mt-8">
                                <p className="text-[1.6rem] uppercase font-semibold mb-3">Customer Information</p>
                                <form>
                                    {renderForms(adult, "Adult")}

                                    {renderForms(children, "Children")}

                                    {renderForms(baby, "Baby")}
                                    <div className="flex">
                                        <button onClick={handleSubmit} className="w-fit py-1 px-5 rounded-md text-white bg-[#FF6500]" type="button">Continue</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="w-[30%] mt-4">
                            <h1 className="w-full mb-2 py-2 px-4 rounded-lg tracking-wider text-white bg-[#FF6500]">
                                <span className="uppercase mr-2">remaining time</span>
                                {formatTime(timeLeft)}
                            </h1>
                            <div className="w-full h-[500px] rounded-t-lg border-2 border-solid border-[#ccc]">
                                <img className="w-full h-[180px] rounded-t-md" src={tour.tourpath} />
                                <div className="py-4 px-6">
                                    <p className="text-[20px] text-center font-montserrat font-bold tracking-wider text-[#0B8494]">{tour.tourname}</p>
                                    <p className="text-[12px] text-center font-semibold"><FontAwesomeIcon className="mr-1" icon={faQrcode} />{tour.tourcode}</p>
                                    <div className="flex justify-center mt-4">
                                        <div className="w-[10%] space-y-2">
                                            <p><FontAwesomeIcon icon={faPlaneDeparture} /></p>
                                            <p><FontAwesomeIcon icon={faCalendarDays} /></p>
                                            {adult && (
                                                <p>
                                                    <FontAwesomeIcon icon={faSackDollar} />
                                                </p>
                                            )}
                                            {children && (
                                                <p className="ml-[2px]">
                                                    <FontAwesomeIcon icon={faChild} />
                                                </p>
                                            )}
                                            {baby && (
                                                <p>
                                                    <FontAwesomeIcon icon={faBaby} />
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-[90%] text-left space-y-[9px]">
                                            <p>Departure: <b>{formatDate(tour.startdate)}</b></p>
                                            <p>Total: <b>{tour.totaldate} days {tour.totaldate - 1} nights</b></p>
                                            {adult && (
                                                <p>
                                                    Adult price: <b>{priceAdult}$ x {adult}</b>
                                                </p>
                                            )}
                                            {children && (
                                                <p>
                                                    Children price: <b>{priceChildren}$ x {children}</b>
                                                </p>
                                            )}
                                            {baby && (
                                                <p>
                                                    Baby price: <b>{priceBaby}$ x {baby}</b>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-left mt-4 text-[1.125rem] space-y-2">
                                        Total: <span className="text-[#FF6500] font-montserrat text-[1.8rem] font-bold tracking-wide">{(adult * priceAdult) + (children * priceChildren) + (baby * priceBaby)}</span>$
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-2xl font-semibold mb-3">Payment</p>
                                <div>
                                    <div className="flex py-3 px-5 rounded-md border-2 border-solid border-[#ccc] cursor-pointer mb-3"
                                        onClick={() => handleOptionChange("cash")}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                className="mr-2"
                                                name="payment"
                                                checked={selectedOption === "cash"}
                                                onChange={() => handleOptionChange("cash")} />
                                            <FontAwesomeIcon className="mr-1" icon={faMoneyBill} />
                                            <p>Cash</p>
                                        </div>
                                    </div>
                                    <div className="flex py-3 px-5 rounded-md border-2 border-solid border-[#ccc] cursor-pointer"
                                        onClick={() => handleOptionChange("paypal")}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                className="mr-2"
                                                name="payment"
                                                checked={selectedOption === "paypal"}
                                                onChange={() => handleOptionChange("paypal")} />
                                            <FontAwesomeIcon className="mr-1" icon={faMoneyBill} />
                                            <p>Paypal</p>
                                        </div>
                                    </div>
                                    {selectedOption === "paypal" && (
                                        <div className="mt-5">
                                            <PayPalButton/>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            ) : (
                loginFormVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleShowLogin}>
                        <div className="custom-slide-modal bg-white rounded-lg shadow-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
                            <h2 className="modal-title text-xl text-center font-semibold mb-4 text-black">Sign in to your account</h2>
                            <form>
                                <div className="text-black mt-10">
                                    <div className="w-[60%] ml-[20%] mr-[20%]">
                                        <div>
                                            <label className=""><FontAwesomeIcon icon={faUser} /> Username</label>
                                            <input onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 mt-2 w-full border border-[#dfdfdf] focus:outline-none rounded-lg block" type="text" placeholder="Email..." />
                                        </div>
                                        <div className="mt-6">
                                            <label className=""><FontAwesomeIcon icon={faLock} /> Password</label>
                                            <input onChange={(e) => setPassword(e.target.value)} className="px-3 py-2 mt-2 w-full border border-[#dfdfdf] focus:outline-none rounded-lg block" type="password" placeholder="Password..." />
                                        </div>
                                        <div className="flex justify-between">
                                            <div></div>
                                            <a className="text-[14px] mt-1 text-[#4B70F5]" href="">Forget password?</a>
                                        </div>
                                        <button onClick={handleSignIn} className="px-3 py-2 mt-6 w-full text-white bg-[#4B70F5] rounded-lg cursor-pointer" type="button">
                                            Sign in
                                        </button>
                                        <div className="mt-[48px] border-t-[1px] border-t-solid border-t-[#888] h-[1.5rem] text-center">
                                            <a className="py-[.5rem] px-[2rem] bg-white text-[#808080] cursor-pointer inline-block m-0 translate-y-[-50%] no-underline font-[Arial]" href="">OR</a>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex justify-center items-center">
                                                <GoogleLoginButton />
                                            </div>
                                            <div className="mt-4">
                                                <p>Don't have an account? <a className="text-[#4B70F5]" href="">Sign up</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export { Check }