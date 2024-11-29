'use client';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faTags, faHeart, faArrowRightFromBracket, faEnvelope, faArrowUp, faHome, faPlane, faLocationDot, faBook, faXmark } from "@fortawesome/free-solid-svg-icons";
import { signIn } from 'next-auth/react';
import GoogleLoginButton from "../lib/GoogleLoginButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Navbar = () => {
  const [login, setLogin] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [userName, setUserName] = useState<any>('');
  const [name, setName] = useState<any>('');
  const [avatar, setAvatar] = useState<string>('');
  const [showCheckbox, setShowCheckbox] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [adminPath, setAdminPath] = useState<any>('');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<any>(null);

  const [forgetOpen, setForgetOpen] = useState<boolean>(false);

  const [isInputEnabled, setIsInputEnabled] = useState<boolean>(false);
  const [savedCode, setSavedCode] = useState<any>(null);
  const [emailCode, setEmailCode] = useState<any>("");
  const [forgetEmail, setForgetEmail] = useState<any>('');
  const [vetifyCode, setVetifyCode] = useState<any>('');
  const [resetEnabled, setResetEnabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<any>('');
  const [disableButton, setDisableButton] = useState<any>('');
  const [changeOpen, setChangeOpen] = useState<boolean>(false);
  const [nPassword, setNPassword] = useState<any>('');
  const [cPassword, setCPassword] = useState<any>('');

  const handleGetToken = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorMessage = '';

    if (!forgetEmail) {
      errorMessage += 'Email cannot be blank.\n';
    } else if (!emailPattern.test(forgetEmail)) {
      errorMessage += 'Email is not in correct format. Example: abc@gmail.com.\n';
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

    setDisableButton(true);
    setTimer(120);
    setIsInputEnabled(true);
    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/auth/user/sendMail`, {
      email: forgetEmail
    }).then(res => {
      setEmailCode(forgetEmail);
      toast.success("Email has been sent. Please check your mailbox", {
        description: formattedDate,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      Cookies.set("verifyCode", res.data.token, { expires: 1 / 288 });
      console.log(res.data.token);
    }).catch(err => {
      console.log('Error fetch data: ' + err);
    })
  }

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer: any) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setDisableButton(false);
    }
  }, [timer]);

  const handleVetifyCodeChange = (e: any) => {
    const code = e.target.value;
    setVetifyCode(code);
    setResetEnabled(code.length === 6);
  }

  const handleVetifyCode = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
    let errorMessage = '';
    const vetify = Cookies.get('verifyCode');
    if (!vetify) {
      errorMessage = 'Verification code has expired! Please get a new authentication code.';
    }

    if (vetifyCode != vetify) {
      errorMessage = 'Authentication code is incorrect! Please try again.';
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

    setForgetOpen(false);
    setChangeOpen(true);
    Cookies.remove('verifyCode');
  }

  const handleChangePassword = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
    let errorMessage = '';

    if (nPassword.length < 8) {
      errorMessage = 'Password has at least 8 characters';
    }

    if (nPassword != cPassword) {
      errorMessage = 'New password and Confirm password do not match';
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

    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/forgotPassword`, {
      newpassword: nPassword,
      confirmpass: cPassword,
      email: emailCode
    }).then(res => {
      if (res.data.success) {
        toast.success("Change password successfully".trim(), {
          description: formattedDate,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        setChangeOpen(false);
      } else {
        toast.success("Change password fail".trim(), {
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


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const admin = sessionStorage.getItem('admin');
      const name = sessionStorage.getItem('adminname');
      const avt = sessionStorage.getItem('adminavatar');
      setUserName(admin);
      setUserName(name);
      setAdminPath(avt);
    }
  }, []);

  const handleShowLogin = () => {
    setLogin(pre => !pre);
    setRegister(false);
  }

  const handleShowRegister = () => {
    setLogin(false);
    setRegister(pre => !pre);
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const user = sessionStorage.getItem('name');
    const avatar = sessionStorage.getItem('avatar');
    if (user && avatar) {
      setName(user);
      setAvatar(avatar);
    }
  }, [name]);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (typeof window !== 'undefined') {
        const role = sessionStorage.getItem('role');
        if (role === 'admin') {
          const result = await Swal.fire({
            title: 'Từ chối quyền truy cập',
            text: 'Bạn đang đăng nhập với quyền Admin và không thể sử dụng được trang của User',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f8b602',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
          });
          if (result.isConfirmed) {
            window.location.href = '/admin/dashboard';
          }
        }
      }
    }
    checkAuthentication();
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Would you like to sign out?',
      text: "You will not be able to undo this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sign out!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('avatar');
        sessionStorage.removeItem('role');
        window.location.href = `/`;
      } else {
        console.log('Fail');
      }
    })
  }

  const handleSignIn = async () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorMessage = '';

    if (!email) {
      errorMessage += 'Email cannot be blank.\n';
    } else if (!emailPattern.test(email)) {
      errorMessage += 'Email is not in correct format. Example: abc@gmail.com.\n';
    }

    if (!password) {
      errorMessage += 'Password cannot be blank.\n';
    } else if (password.length < 8) {
      errorMessage += 'Password must be at least 8 characters.\n';
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

    const loginData = {
      email: email,
      password: password
    }
    try {
      const res = await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/auth/login`, loginData);
      const result = await res.data;
      const role = result.role;
      const token = result.token;

      if (role === 'user') {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', result.user.user.userid);
        sessionStorage.setItem('name', result.user.user.username);
        sessionStorage.setItem('avatar', result.user.user.userpath);
        sessionStorage.setItem('role', 'client');
        setLogin(false);
        window.location.href = `/`;
      } else if (role === 'admin') {
        sessionStorage.setItem('admintoken', token);
        sessionStorage.setItem('admin', result.user.admin.adminid);
        sessionStorage.setItem('adminname', result.user.admin.adminname);
        sessionStorage.setItem('adminavatar', result.user.admin.adminpath);
        sessionStorage.setItem('role', 'admin');
        window.location.href = `/admin/dashboard`;
      } else {
        throw new Error('Invalid role detected!');
      }

    } catch (error: any) {
      const errorMessage = 'Login failed! Account does not exist or wrong credentials.';

      toast.error(errorMessage, {
        description: formattedDate,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      console.error('Error:', error);
    }
  }

  const handleSignUp = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorMessage = '';

    if (!userName) {
      errorMessage += 'Name cannot be blank.\n';
    }

    if (!email) {
      errorMessage += 'Email cannot be blank.\n';
    } else if (!emailPattern.test(email)) {
      errorMessage += 'Email is not in correct format. Example: abc@gmail.com.\n';
    }

    if (!password) {
      errorMessage += 'Password cannot be blank.\n';
    } else if (password.length < 8) {
      errorMessage += 'Password must be at least 8 characters.\n';
    }

    if (!confirmPassword) {
      errorMessage += 'Confirm Password cannot be blank.\n';
    } else if (password !== confirmPassword) {
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

    const registerData = {
      email: email,
      name: userName,
      password: password,
    };

    console.log(registerData);

    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/users/register`, registerData)
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
          setRegister(false);
          setLogin(true);
        } else {
          const errorMessage = 'Sign up failed: Account already exists';
          toast.error(errorMessage, {
            description: formattedDate,
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        }
        console.log(res.data);
      })
      .catch(err => {
        console.log('Error fetching data: ' + err);
      });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        setShowCheckbox(true);
      } else {
        setShowCheckbox(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    router.push('/')
  }

  const handleDestination = () => {
    router.push('/destination')
  }

  const handleBlog = () => {
    router.push('/blog');
  }

  const handleTravel = () => {
    router.push('/travel');
  }

  return (
    <div className="flex w-full justify-between items-center h-20 px-6 absolute z-10 text-white">
      <div>
        <h1 className="font-bold text-3xl py-3 px-1">Planners.</h1>
      </div>
      <ul className={`hidden md:flex justify-between items-center gap-10 relative ${name ? 'left-[5px]' : 'left-[-30px]'}`}>
        <Link href="/">
          <li className="hover:text-blue-400 hover:underline duration-200">Home</li>
        </Link>
        <Link href="/destination">
          <li className="hover:text-blue-400 hover:underline duration-200">Destination</li>
        </Link>
        <Link href="/travel">
          <li className="hover:text-blue-400 hover:underline duration-200">Travel</li>
        </Link>
        <Link href="/blog">
          <li className="hover:text-blue-400 hover:underline duration-200">Blog</li>
        </Link>
      </ul>
      {showCheckbox && (
        <div className="menu-container">
          <input className="checkbox" type="checkbox" id="menuToggle" />
          <label htmlFor="menuToggle" className="button-menu"></label>
          <button onClick={handleDestination} className="option-d option" title="Destination"><FontAwesomeIcon icon={faPlane} /></button>
          <button onClick={handleSignIn} className="option-e option" title="Sign in"><FontAwesomeIcon icon={faUser} /></button>
          <button onClick={handleHome} className="option-a option" title="Home"><FontAwesomeIcon icon={faHome} /></button>
          <button onClick={handleBlog} className="option-b option" title="Blog"><FontAwesomeIcon icon={faBook} /></button>
          <button onClick={handleTravel} className="option-c option" title="Travel"><FontAwesomeIcon icon={faLocationDot} /></button>
        </div>
      )}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}

      {name ? (
        <div className="hidden md:flex gap-10 group" ref={menuRef}>
          <div className="relative">
            <div className="cursor-pointer hover:text-blue-400 duration-200 border-2 border-solid border-white py-1 px-2 rounded-[50px]" onClick={toggleMenu}>
              <div className="flex items-center justify-center">
                <img className="w-[25px] h-[25px] rounded-[50%] bg-white mr-2" src={avatar} />
                {name}
              </div>
            </div>
            {isOpen && (
              <ul className="absolute space-y-1 pb-1 top-8 pt-2 left-[-9em] mt-2 w-48 bg-white shadow-lg flex flex-col rounded-lg z-50 border border-gray-200">
                <div className="absolute w-2 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white top-[-4px] right-4 transform -translate-x-1/2" />
                <li className="flex justify-center items-center mx-4 px-2 hover:bg-gray-200 rounded-lg">
                  <div className="w-[5%]">
                    <FontAwesomeIcon icon={faTags} className="text-black" />
                  </div>
                  <div className="w-[95%]">
                    <a href="/booking" className="block px-4 py-2 text-black hover:no-underline pt-3 pb-3 font-semibold text-sm">Bookings</a>
                  </div>
                </li>
                <li className="flex justify-center items-center mx-4 px-2 hover:bg-gray-200 rounded-lg">
                  <div className="w-[5%]">
                    <FontAwesomeIcon icon={faHeart} className="text-black" />
                  </div>
                  <div className="w-[95%]">
                    <a href="/wishlist" className="block px-4 py-2 text-black hover:no-underline pt-3 pb-3 font-semibold text-sm">Wishlist</a>
                  </div>
                </li>
                <li className="flex justify-center items-center mx-4 px-2 hover:bg-gray-200 rounded-lg">
                  <div className="w-[5%]">
                    <FontAwesomeIcon icon={faUser} className="text-black" />
                  </div>
                  <div className="w-[95%]">
                    <a href="/profile" className="block px-4 py-2 text-black hover:no-underline pt-3 pb-3 font-semibold text-sm">Profile</a>
                  </div>
                </li>
                <div className="w-full h-[1px] border-[1px] border-solid border-[#dfdfdf]"></div>
                <li className="flex justify-center items-center mx-4 px-2 hover:bg-gray-200 rounded-lg">
                  <div className="w-[5%]">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-black" />
                  </div>
                  <div className="w-[95%]">
                    <a onClick={handleLogout} className="block px-4 py-2 text-black hover:no-underline pt-3 pb-3 font-semibold text-sm cursor-pointer">Logout</a>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex gap-10">
          <p onClick={handleShowLogin} className="flex items-center justify-center hover:text-blue-400 duration-200 cursor-pointer border-2 border-solid border-white py-1 px-2 rounded-lg"><BsPerson className="mr-1" size={20} /> Sign in</p>
        </div>
      )}
      {login && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleShowLogin}>
          <div className="custom-slide-modal bg-white rounded-lg shadow-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title text-xl text-center font-semibold mb-4 text-black">Sign in to your account</h2>
            <form onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSignIn();
              }
            }}>
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
                    <a className="text-[14px] mt-2 text-[#4B70F5] underline" onClick={() => {
                      setForgetOpen(true);
                      setLogin(false);
                    }}>Forget password?</a>
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
                      <p>Don't have an account? <a className="text-[#4B70F5]" onClick={handleShowRegister}>Sign up</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {forgetOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
          <div className="bg-white text-black w-[600px] h-[650px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between">
                <div></div>
                <div onClick={() => setForgetOpen(false)}>
                  <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-center">Planners<span className="text-[#f8b602]">.</span></p>
              </div>
              <div className="text-[1.2rem] mt-3 text-center font-semibold">
                Forgot password?
              </div>
              <div className="mt-3 text-center">
              Enter your email or username and we'll send you a password recovery code.
              </div>
              <div className="mt-5">
                <label className="ml-2 text-[.9rem] font-semibold">Tên đăng nhập</label>
                <input
                  type="text"
                  value={forgetEmail}
                  placeholder="Enter your email"
                  onChange={(e) => setForgetEmail(e.target.value)}
                  className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
              </div>
              <div className="mt-2 ml-3 text-[.9rem]">
                Tên đăng nhập của bạn đã được điền sẵn. Để lấy mã khôi phục mật khẩu, hãy nhấn "Gửi mã".
              </div>
              <div className="flex items-center mt-5 relative">
                <input
                  type="text"
                  placeholder="Enter vetify code"
                  onChange={handleVetifyCodeChange}
                  className={`w-full py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf] ${isInputEnabled ? 'bg-white' : 'bg-[#ccc] pointer-events-none'
                    }`}
                  disabled={!isInputEnabled}
                />
                <button
                  onClick={handleGetToken}
                  disabled={disableButton}
                  className={`absolute right-0 ml-3 px-8 py-2 font-semibold text-white rounded-3xl focus:outline-none ${disableButton ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                  {disableButton ? `Resend later ${timer}s` : "Send code"}
                </button>
              </div>

              <div
                onClick={handleVetifyCode}
                className={`w-full font-semibold bg-custom-gradient focus:outline-[#1dbfaf] text-white text-center mt-14 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl ${resetEnabled
                  ? "bg-custom-gradient cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
                  }`}
              >
                Reset password
              </div>
            </div>
          </div>
        </div>
      )}
      {register && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleShowRegister}>
          <div className="custom-slide-modal bg-white rounded-lg shadow-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title text-xl text-center font-semibold mb-4 text-black">Sign up</h2>
            <form>
              <div className="text-black mt-10">
                <div className="w-[60%] ml-[20%] mr-[20%]">
                  <div>
                    <label className=""><FontAwesomeIcon icon={faUser} /> Name</label>
                    <input onChange={(e) => setUserName(e.target.value)} className="px-3 py-2 mt-2 w-full border border-[#dfdfdf] focus:outline-none rounded-lg block" type="text" placeholder="Name..." />
                  </div>
                  <div className="mt-6">
                    <label className=""><FontAwesomeIcon icon={faEnvelope} /> Username</label>
                    <input onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 mt-2 w-full border border-[#dfdfdf] focus:outline-none rounded-lg block" type="text" placeholder="Email..." />
                  </div>
                  <div className="mt-6">
                    <label className=""><FontAwesomeIcon icon={faLock} /> Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className="px-3 py-2 mt-2 w-full border border-[#dfdfdf] focus:outline-none rounded-lg block" type="password" placeholder="Password..." />
                  </div>
                  <div className="mt-6">
                    <label className=""><FontAwesomeIcon icon={faLock} /> Confirm Password</label>
                    <input onChange={(e) => setConfirmPassword(e.target.value)} className="px-3 py-2 mt-2 w-full border border-[#dfdfdf] focus:outline-none rounded-lg block" type="password" placeholder="Confirm Password..." />
                  </div>
                  <button onClick={handleSignUp} className="px-3 py-2 mt-6 w-full text-white bg-[#4B70F5] rounded-lg cursor-pointer" type="button">
                    Sign up
                  </button>
                  <div className="mt-[48px] border-t-[1px] border-t-solid border-t-[#888] h-[1.5rem] text-center">
                    <a className="py-[.5rem] px-[2rem] bg-white text-[#808080] cursor-pointer inline-block m-0 translate-y-[-50%] no-underline font-[Arial]" href="">OR</a>
                  </div>
                  <div className="text-center">
                    <div className="mt-4">
                      <p>Do you already have an account? <a className="text-[#4B70F5]" onClick={handleShowLogin}>Sign in</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {changeOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 cursor-pointer overflow-y-auto">
          <div className="bg-white text-black w-[600px] h-[500px] p-7 shadow-lg z-60 relative rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between">
                <div></div>
                <div onClick={() => setForgetOpen(false)}>
                  <FontAwesomeIcon className="text-[#777] text-[1.5rem]" icon={faXmark} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-center">Planners<span className="text-[#f8b602]">.</span></p>
              </div>
              <div className="text-[1.2rem] mt-3 text-center font-semibold">
                Change password?
              </div>
              <div className="mt-3 text-center">
                Enter the new password you want to change
              </div>
              <div className="mt-5">
                <label className="ml-2 text-[.9rem] font-semibold">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setNPassword(e.target.value)}
                  className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
              </div>
              <div className="mt-5">
                <label className="ml-2 text-[.9rem] font-semibold">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Enter confirm password"
                  onChange={(e) => setCPassword(e.target.value)}
                  className="w-full mt-2 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl focus:outline-[#1dbfaf]" />
              </div>

              <div
                onClick={handleChangePassword}
                className={`w-full font-semibold bg-custom-gradient focus:outline-[#1dbfaf] text-white text-center mt-14 py-2 px-5 border-[1px] border-solid border-[#ccc] rounded-3xl ${resetEnabled
                  ? "bg-custom-gradient cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
                  }`}
              >
                Save change
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
