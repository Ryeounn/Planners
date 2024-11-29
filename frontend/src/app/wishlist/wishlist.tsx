'use client';
import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

const List = () => {
    const [group, setGroup] = useState<any>([]);
    const [userId, setUserId] = useState<any>('');
    const [latestWishlistIds, setLatestWishlistIds] = useState<any>([]);
    const [quantity, setQuantity] = useState<any>([]);
    const [createForm, setCreateForm] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userid = sessionStorage.getItem('user');
            setUserId(userid);
        }
    }, [userId]);

    const handleOpenNew = () => {
        setCreateForm(true);
    }

    const handleCloseOpenNew = () => {
        setCreateForm(false);
    }

    useEffect(() => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/groupwishlist/getAllByUserId`, {
            userid: userId
        }).then(res => {
            setGroup(res.data);
            res.data.forEach((groupItem: any) => {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/findWishListLastest`, {
                    groupwishlistid: groupItem.groupwishlistid
                }).then(response => {
                    setLatestWishlistIds((prevPaths: any) => ({
                        ...prevPaths,
                        [groupItem.groupwishlistid]: response.data?.tour?.tourpath || ''
                    }));
                    res.data.forEach((groupItem: any) => {
                        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/countAllWistlistByGroup`, {
                            groupwishlistid: groupItem.groupwishlistid
                        }).then(response => {
                            setQuantity((prevCounts: any) => ({
                                ...prevCounts,
                                [groupItem.groupwishlistid]: response.data
                            }));
                        }).catch(error => {
                            console.log(`Error fetching count for groupwishlistid ${groupItem.groupwishlistid}: ` + error);
                        });
                    });
                    console.log(response.data.tour.tourpath);
                }).catch(error => {
                    console.log('Error fetching wishlist data: ' + error);
                });
            });
            console.log(res.data);
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }, [userId]);

    const handleCreateWishList = () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';

        if (!name) {
            errorMessage += 'Group name cannot be blank.\n';
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
            userId: userId,
            name: name
        }

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/groupwishlist/createGroupwishlist`, createData)
            .then(res => {
                if (res.data.success) {
                    const successMessage = 'Created Group successfully';
                    toast.success(successMessage, {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                    setName('');
                    setCreateForm(false);
                    axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/groupwishlist/getAllByUserId`, {
                        userid: userId
                    }).then(res => {
                        setGroup(res.data);
                    }).catch(err => {
                        console.log('Error fetching groups: ' + err);
                    });
                } else {
                    const failMessage = 'Created Group fail';
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

    const handleDeleteGroup = (groupwishlistid: number) => {
        const deleteData = {
            groupwishlistid,
            userid: userId
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You will not be able to undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/wishlist/deleteGroupWishlist`, deleteData)
                    .then(res => {
                        const currentDate = new Date();
                        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                        if (res.data.success) {
                            setGroup((prevGroups: any) => prevGroups.filter((g: any) => g.groupwishlistid !== groupwishlistid));
                            const successMessage = 'Delete Tour successfully';
                            toast.success(successMessage, {
                                description: formattedDate,
                                action: {
                                    label: "Undo",
                                    onClick: () => console.log("Undo"),
                                },
                            });
                        }
                    })
                    .catch(err => {
                        console.error('Error deleting group wishlist: ', err);
                    });
            }
        })
    }

    return (
        <div>
            <div className="grid grid-cols-4 gap-10">
                <div
                    onClick={handleOpenNew}
                    className="w-full h-[380px] border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                    <div className="w-[calc(100%-10%)] mt-5 mx-[5%] h-[250px] bg-[#ccc] rounded-lg">
                        <div className="flex items-center justify-center">
                            <FontAwesomeIcon className="text-[50px] relative top-24 text-white" icon={faPlus} />
                        </div>
                    </div>
                    <p className="mt-5 text-[20px] font-semibold text-center">New wishlist</p>
                </div>
                {group.map((item: any) => (
                    <Link key={item.groupwishlistid} href={`/wishlist/${item.groupname.replace(/\s+/g, '-')}-${item.groupwishlistid}`}>
                        <div className="w-full h-[380px] border-[1px] border-solid border-[#ccc] rounded-lg cursor-pointer">
                            <div className={`w-[calc(100%-10%)] mt-5 mx-[5%] h-[250px] bg-[#ccc] rounded-lg relative`}>
                                {latestWishlistIds[item.groupwishlistid] ? (
                                    <img src={latestWishlistIds[item.groupwishlistid]} alt="Tour Image" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <img src="/assets/images/app/wishlistempty.jpg" alt="Empty Wishlist" className="w-full h-full object-cover rounded-lg" />
                                )}
                                <FontAwesomeIcon onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteGroup(item.groupwishlistid)
                                }} className="absolute top-2 right-2 text-[24px] text-white" icon={faXmarkCircle} />
                            </div>
                            <p className="mt-5 mx-[5%] text-[20px] font-semibold">{item.groupname}</p>
                            <p className="mt-1 mx-[5%]">
                                {quantity[item.groupwishlistid] !== undefined
                                    ? `${quantity[item.groupwishlistid]} experiences`
                                    : '0 experiences'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            {createForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 cursor-pointer" onClick={handleCloseOpenNew}>
                    <div className="custom-slide-modal bg-white rounded-lg shadow-lg p-6 w-[600px]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <div></div>
                            <div>
                                <FontAwesomeIcon onClick={handleCloseOpenNew} className="text-[24px]" icon={faXmarkCircle} />
                            </div>
                        </div>
                        <h2 className="modal-title text-xl font-bold mb-4 text-black">Name your wishlist</h2>
                        <form>
                            <div className="text-black mt-8">
                                <input
                                    type="text"
                                    className="w-full py-2 px-3 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-none"
                                    placeholder="Enter group name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div
                                    onClick={handleCreateWishList}
                                    className="w-fit h-fit py-2 px-8 mt-5 font-semibold rounded-md text-white bg-[#0B8494]">
                                    Create wishlist
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default List;