'use client';
import { useEffect, useState } from "react";
import Information from "../layout/info"
import Swal from "sweetalert2";
import { checkAuth } from "@/app/auth/auth";
import axios from "axios";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";

const ManageBlog = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [adminid, setAdminid] = useState<string | null>('');
    const [adminName, setAdminName] = useState<any>('');
    const [adminPath, setAdminPath] = useState<any>('');
    const [activeStatus, setActiveStatus] = useState("All");
    const [keyword, setKeyword] = useState<any>('');
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [blog, setBlog] = useState<any>([]);
    const [paragraphs, setParagraphs] = useState<any>([]);
    const [nation, setNation] = useState<any>([]);
    const [file, setFile] = useState<any>('');
    const [fetchData, setFetchData] = useState<any>('');
    const [addPara, setAddPara] = useState<any>([{ content: "", image: null }]);
    const [editPara, setEditPara] = useState<any>([{ paragraphid: "",blogimageid: "" ,content: "", image: null }]);

    const [createTitle, setCreateTitle] = useState<any>('');
    const [createLocal, setCreateLocal] = useState<any>('');
    const [createContent, setCreateContent] = useState<any>('');
    const [createImage, setCreateImage] = useState<any>('');

    const [editBlog, setEditBlog] = useState<any>('');
    const [editAdminName, setEditAdminName] = useState<any>('');
    const [editAdminPath, setEditAdminPath] = useState<any>('');
    const [editCreate, setEditCreate] = useState<any>('');
    const [editTitle, setEditTitle] = useState<any>('');
    const [editLocal, setEditLocal] = useState<any>('');
    const [editContent, setEditContent] = useState<any>('');
    const [editImage, setEditImage] = useState<any>('');
    const [editFile, setEditFile] = useState<any>('');


    const addParagraph = () => {
        setAddPara([...addPara, { content: "", image: null }]);
    };

    useEffect(() => {
        if (!createOpen) {
            setCreateTitle('');
            setCreateLocal('');
            setCreateContent('');
            setCreateImage('');
        }
    }, [createOpen]);

    const statuses = [
        { label: "Tất cả", search: "All", color: "text-gray-500", bg: "bg-gray-500" },
        { label: "Mới nhất", search: "Desc", color: "text-blue-500", bg: "bg-blue-500" },
        { label: "Cũ Nhất", search: "Asc", color: "text-green-500", bg: "bg-green-500" },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const admin = sessionStorage.getItem('admin');
            const name = sessionStorage.getItem('adminname');
            const avt = sessionStorage.getItem('adminavatar');
            setAdminid(admin);
            setAdminName(name);
            setAdminPath(avt);
        }
    }, [adminid]);

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
        if(keyword){
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/findAllByCode`, {
                keyword: keyword
            }).then(res => {
                setBlog(res.data);
                console.log(res.data);
    
                const blogids = res.data.map((item: any) => item.blogid);
    
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/paragraphs/findAllById`, {
                    blogids
                }).then(response => {
                    const groupedParagraphs = response.data.reduce((acc: any, paragraph: any) => {
                        const blogid = paragraph.blog.blogid;
                        if (!acc[blogid]) acc[blogid] = [];
                        acc[blogid].push(paragraph);
                        return acc;
                    }, {});
    
                    setParagraphs(groupedParagraphs);
                    console.log(response.data);
                }).catch(error => {
                    console.log('Error fetch data: ' + error);
                })
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        }else{
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/findAll`, {
                status: activeStatus
            }).then(res => {
                setBlog(res.data);
                console.log(res.data);
    
                const blogids = res.data.map((item: any) => item.blogid);
    
                axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/paragraphs/findAllById`, {
                    blogids
                }).then(response => {
                    const groupedParagraphs = response.data.reduce((acc: any, paragraph: any) => {
                        const blogid = paragraph.blog.blogid;
                        if (!acc[blogid]) acc[blogid] = [];
                        acc[blogid].push(paragraph);
                        return acc;
                    }, {});
    
                    setParagraphs(groupedParagraphs);
                    console.log(response.data);
                }).catch(error => {
                    console.log('Error fetch data: ' + error);
                })
            }).catch(err => {
                console.log('Error fetch data: ' + err);
            })
        }
    }, [activeStatus, fetchData, keyword]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCreateImage(previewUrl);
            setFile({ file: file, fileName: file.name, type: 'image' });
        }
    };

    const handleEditFileChange = (e: any) =>{
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEditImage(previewUrl);
            setEditFile({ file: file, fileName: file.name, type: 'image' });
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

    const handleCreate = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';

        if (!createTitle) {
            errorMessage += 'Tên bài viết không được trống\n';
        }

        if (!createLocal) {
            errorMessage += 'Tên địa điểm không được trống\n';
        }

        if (!createContent) {
            errorMessage += 'Nội dung không được trống\n';
        }

        if (!createImage) {
            errorMessage += 'Hình ảnh không được trống\n';
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

        const mainImageUrl = await handleUpload(file.file);

        const uploadedImageUrls = await Promise.all(
            addPara.map((para: any) => handleUpload(para.image))
        );

        const data = {
            name: createTitle,
            content: createContent,
            location: createLocal,
            adminid: adminid,
            images: mainImageUrl,
            paragraphs: addPara.map((para: any, index: any) => ({
                content: para.content,
                position: index + 1,
                image: uploadedImageUrls[index],
            })),
        };

        if (data) {
            console.log('Data to send:', data);
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/create`, data)
                .then(res => {
                    setFetchData((pre: any) => !pre);
                    setCreateOpen(false);
                    errorMessage = 'Tạo bài viết thành công';
                    console.log(res.data);
                    toast.success(errorMessage.trim(), {
                        description: formattedDate,
                        action: {
                            label: "Undo",
                            onClick: () => console.log("Undo"),
                        },
                    });
                }).catch(err => {
                    console.log('Error fetch data: ' + err);
                })
        } else {
            console.log('b');
            errorMessage = 'Dữ liệu còn thiếu!';
            toast.error(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            return;
        }
    }

    const handleEdit = async() =>{
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';

        if (!editTitle) {
            errorMessage += 'Tên bài viết không được trống\n';
        }

        if (!editLocal) {
            errorMessage += 'Tên địa điểm không được trống\n';
        }

        if (!editContent) {
            errorMessage += 'Nội dung không được trống\n';
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

        let result;
        let uploadedImageUrls;
        if (editFile && editFile.file) {
            result = await handleUpload(editFile.file);
        } else {
            result = editImage;
        }

        if(editPara){
            uploadedImageUrls = await Promise.all(
                editPara.map((para: any) => handleUpload(para.image))
            );
        }else{
            uploadedImageUrls = editPara.map((para: any) => para.image);
        }

        console.log(uploadedImageUrls);

        const data = {
            name: editTitle,
            content: editContent,
            location: editLocal,
            adminid: adminid,
            blogid: editBlog,
            images: result,
            paragraphs: editPara.map((para: any, index: any) => ({
                paragraphid: para.paragraphid,
                content: para.content,
                position: index + 1,
                image: uploadedImageUrls[index],
                blogimageid: para.blogimageid
            })),
        };

        console.log(data);

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/update`,data)
        .then(res =>{
            setFetchData((pre: any) => !pre);
            setEditOpen(false);
            errorMessage = 'Sửa bài viết thành công';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            console.log(res.data);
        }).catch(err =>{
            errorMessage = 'Sửa bài viết thất bại';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            console.log('Error fetch data: ' + err);
        })
        
    }

    const handleDelete = async() =>{
        const currentDate = new Date();
        const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
        let errorMessage = '';

        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/delete`,{
            blogid: editBlog
        }).then(res =>{
            setFetchData((pre: any) => !pre);
            setEditOpen(false);
            errorMessage = 'Xóa bài viết thành công';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            console.log(res.data);
        }).catch(err =>{
            errorMessage = 'Xóa bài viết thất bại';
            toast.success(errorMessage.trim(), {
                description: formattedDate,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            console.log('Error fetch data: ' + err);
        })
    }

    const handleFindBlog = (blogid: number) => {
        axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/blog/findById`, {
            blogid
        }).then(res => {
            setEditBlog(res.data.blogid);
            setEditTitle(res.data.title);
            setEditLocal(res.data.locations);
            setEditImage(res.data.blogimg);
            setEditCreate(res.data.created);
            setEditContent(res.data.descript);
            setEditAdminName(res.data.admin.adminname);
            setEditAdminPath(res.data.admin.adminpath);
            setEditOpen(true);
            console.log(res.data);
            axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/paragraphs/findById`,{
                blogid: res.data.blogid
            }).then(response =>{
                const data = response.data.map((item: any) => ({
                    paragraphid: item.paragraphsid,
                    blogimageid: item.blogImage?.blogimageid,
                    content: item.content,
                    image: item.blogImage?.imagepath || null,
                  }));
                  setEditPara(data);
                  console.log(data);
            }).catch(error =>{
                console.log('Error fetch data: ' + error);
            })
        }).catch(err => {
            console.log('Error fetch data: ' + err);
        })
    }

    useEffect(() => {
        console.log(addPara);
    }, [addPara]);

    return (
        <div className={isAuthenticated ? '' : 'blurred-content'}>
            <div className="mx-10">
                <div className="flex items-center justify-between">
                    <p className="text-[1.2rem] font-sans font-semibold">Bài viết</p>
                    <div className="w-[35%] flex items-center justify-around">
                        <input
                            type="text"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Nhập mã bài viết..."
                            className="w-[75%] mr-3 py-1 px-3 border-[1px] border-solid border-[#ccc] focus:outline-none rounded-md" />
                        <Information />
                    </div>
                </div>
                <div className="mt-10">
                    <div className="flex items-center justify-between">
                        <div>Trạng thái</div>
                        <div className="flex space-x-3">
                            {statuses.map((status) => (
                                <p
                                    key={status.label}
                                    onClick={() => setActiveStatus(status.search)}
                                    className={`w-[150px] text-center py-1 font-semibold cursor-pointer ${status.color} ${activeStatus === status.search ? `relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[3px] after:bg-[#f8b602]` : ""
                                        }`}
                                >
                                    {status.label}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="my-5 space-y-2">
                        <Carousel className="w-[calc(100%-10px)] space-x-5">
                            <CarouselContent>
                                {[
                                    ...Array(Math.ceil((blog.length + 1) / 2))
                                        .fill(0)
                                        .map((_, pageIndex) => {
                                            const items =
                                                pageIndex === 0
                                                    ? [{ isPlus: true }, ...blog.slice(0, 1)]
                                                    : blog.slice(pageIndex * 2 - 1, pageIndex * 2 + 1);
                                            return (
                                                <CarouselItem key={pageIndex} className="flex space-x-4">
                                                    {items.map((item: any, index: number) => (
                                                        item.isPlus ? (
                                                            <div
                                                                key={`plus-${index}`}
                                                                onClick={() => setCreateOpen(true)}
                                                                className="w-[calc(100%/2)] h-[565px] flex flex-col justify-center items-center border-[1px] border-solid border-[#ccc] rounded-md ml-[20px] px-10 overflow-y-auto cursor-pointer"
                                                            >
                                                                <FontAwesomeIcon className="text-[10rem] text-[#ccc] text-center" icon={faPlus} />
                                                                <p className="text-[1.5rem] font-semibold">Bài viết mới</p>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={item.blogid}
                                                                onClick={() => handleFindBlog(item.blogid)}
                                                                className="w-[calc(100%/2)] h-[565px] border-[1px] border-solid border-[#ccc] rounded-md ml-[20px] px-10 cursor-pointer overflow-y-auto"
                                                            >
                                                                <p className="mt-10 text-[1.5rem] font-bold text-center">
                                                                    {item.title}
                                                                </p>
                                                                <p className="text-center font-semibold"><FontAwesomeIcon className="mr-2 italic text-blue-500" icon={faLocationDot} />{item.locations}</p>
                                                                <div className="flex items-center mt-5">
                                                                    <div className="w-[15%]">
                                                                        <Image
                                                                            loading="lazy"
                                                                            className="w-[60px] h-[60px] rounded-[50%] border-[1px] border-solid border-[#ccc]"
                                                                            alt="Images Admin"
                                                                            src={item.admin.adminpath}
                                                                            width={50}
                                                                            height={50}
                                                                        />
                                                                    </div>
                                                                    <div className="w-[40%]">
                                                                        <p className="text-[1.1rem] font-bold">{item.admin.adminname}</p>
                                                                        <p className="flex items-center text-[1rem]">
                                                                            <FontAwesomeIcon
                                                                                className="text-[.3rem] text-[#777] mr-2"
                                                                                icon={faCircle}
                                                                            />{" "}
                                                                            {formatDate(item.created)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-10">
                                                                    <Image
                                                                        loading="lazy"
                                                                        className="rounded-md"
                                                                        alt="Images Blog"
                                                                        src={item.blogimg}
                                                                        width={1200}
                                                                        height={300}
                                                                    />
                                                                    <p className="mt-5 text-center italic px-3 mb-10">
                                                                        {item.descript}
                                                                    </p>
                                                                    {paragraphs[item.blogid]?.map((i: any, index: number) => (
                                                                        <div key={index} className="my-10">
                                                                            <Image
                                                                                loading="lazy"
                                                                                className="rounded-md"
                                                                                alt="Images Paragraph"
                                                                                src={i.blogImage.imagepath}
                                                                                width={1200}
                                                                                height={400}
                                                                            />
                                                                            <p className="mt-3 italic text-center text-[1.1rem]">
                                                                                {i.content}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                </CarouselItem>
                                            );
                                        }),
                                ]}
                            </CarouselContent>
                            <CarouselPrevious>
                                <button className="px-2 py-2 text-white bg-blue-500 rounded-md">Prev</button>
                            </CarouselPrevious>
                            <CarouselNext>
                                <button className="absolute px-2 py-2 text-white bg-blue-500 rounded-md">Next</button>
                            </CarouselNext>
                        </Carousel>
                    </div>
                    {createOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setCreateOpen(false)}>
                            <div className="w-[100%] px-[8%] bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-center items-center p-4">
                                    <h3 className="text-xl text-center font-semibold my-2">Thêm bài viết mới</h3>
                                </div>
                                <div className="w-full h-full flex">
                                    <div className="w-[40%] h-[600px] overflow-y-auto">
                                        <div className="mx-[5%]">
                                            <p className="text-[1.25rem] my-3 font-semibold">Thông tin bài viết</p>
                                            <div className="mt-3">
                                                <label>Tên bài viết</label>
                                                <input type="text"
                                                    onChange={(e) => setCreateTitle(e.target.value)}
                                                    placeholder="Nhập tên bài viết..."
                                                    className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                            </div>
                                            <div className="mt-3">
                                                <label>Địa điểm</label>
                                                <select onChange={(e) => setCreateLocal(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
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
                                                <label>Hình ảnh</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    // onChange={(e) => {
                                                    //     const files = e.target.files;
                                                    //     if (files && files.length > 0) {
                                                    //         const updatedParas = [...addPara];
                                                    //         updatedParas[index].image = files[0];
                                                    //         setAddPara(updatedParas);
                                                    //     }
                                                    // }}
                                                    className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <label>Nội dung</label>
                                                <textarea
                                                    placeholder="Nhập nội dung..."
                                                    onChange={(e) => setCreateContent(e.target.value)}
                                                    className="w-full h-32 mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                ></textarea>
                                            </div>
                                            <div>
                                                {addPara.map((para: any, index: any) => (
                                                    <div key={index} className="mb-6">
                                                        <div className="mt-3">
                                                            <label>Hình ảnh</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const files = e.target.files;
                                                                    if (files && files.length > 0) {
                                                                        const updatedParas = [...addPara];
                                                                        updatedParas[index].image = files[0];
                                                                        setAddPara(updatedParas);
                                                                    }
                                                                }}
                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <label>Nội dung</label>
                                                            <textarea
                                                                placeholder="Nhập..."
                                                                value={para.content}
                                                                onChange={(e) => {
                                                                    const updatedParas = [...addPara];
                                                                    updatedParas[index].content = e.target.value;
                                                                    setAddPara(updatedParas);
                                                                }}
                                                                className="w-full h-32 mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div
                                                    onClick={addParagraph}
                                                    className="w-full h-[100px] flex items-center justify-center my-8 border-[1px] border-solid border-[#ccc] rounded-md cursor-pointer hover:bg-gray-100"
                                                >
                                                    <FontAwesomeIcon className="text-[1.25rem] mr-2 text-[#777]" icon={faPlus} />
                                                    Thêm đoạn văn
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[20%]"></div>
                                    <div className="w-[40%] h-[500px]">
                                        <p className="text-[1.25rem] my-3 font-semibold">Xem trước</p>
                                        <div className="w-full h-full border-[1px] border-solid border-[#ccc] rounded-md overflow-y-auto">
                                            {createTitle && (
                                                <p className="text-[1.25rem] font-semibold mt-5 text-center">{createTitle}</p>
                                            )}
                                            {createLocal && (
                                                <p className="text-center font-semibold"><FontAwesomeIcon className="mr-2 italic text-blue-500" icon={faLocationDot} />{createLocal}</p>
                                            )}
                                            {createTitle && createLocal && (
                                                <div className="flex items-center ml-[5%] mt-5">
                                                    <div className="w-[15%]">
                                                        <Image
                                                            loading="lazy"
                                                            className="w-[60px] h-[60px] rounded-[50%] border-[1px] border-solid border-[#ccc]"
                                                            alt="Images Admin"
                                                            src={adminPath}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </div>
                                                    <div className="w-[40%]">
                                                        <p className="text-[1.1rem] font-bold">{adminName}</p>
                                                        <p className="flex items-center text-[1rem]">
                                                            <FontAwesomeIcon
                                                                className="text-[.3rem] text-[#777] mr-2"
                                                                icon={faCircle}
                                                            />{" "}
                                                            {formatDate((new Date()).toString())}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {createImage && (
                                                <img className="px-4 pt-4 w-full rounded-md object-cover h-[200px]" src={createImage} />
                                            )}
                                            {createContent && (
                                                <p className="mt-1 text-[.9rem] text-center italic px-3 mb-10 break-words">
                                                    {createContent}
                                                </p>
                                            )}
                                            {addPara && addPara.map((para: any, index: number) => (
                                                <div key={index} className="px-4 mb-4">
                                                    {para.image && (
                                                        <Image
                                                            loading="lazy"
                                                            className="w-full rounded-md object-cover h-[200px] mb-2"
                                                            alt={`Uploaded ${index}`}
                                                            src={URL.createObjectURL(para.image)}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    )}
                                                    {para.content && (
                                                        <p className="text-[.9rem] italic break-words">{para.content}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-4 gap-10 mt-5">
                                        <div></div>
                                        <button
                                            onClick={(e) => setCreateOpen(false)}
                                            className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                                        >
                                            Tạo bài viết
                                        </button>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {editOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setEditOpen(false)}>
                            <div className="w-[100%] h-[700px] px-[8%] bg-white rounded-lg shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-center items-center p-4">
                                    <h3 className="text-xl text-center font-semibold my-2">Sửa bài viết</h3>
                                </div>
                                <div className="w-full h-[620px] flex">
                                    <div className="w-[40%] h-[600px] overflow-y-auto">
                                        <div className="mx-[5%]">
                                            <p className="text-[1.25rem] my-3 font-semibold">Thông tin bài viết</p>
                                            <div className="mt-3">
                                                <label>Tên bài viết</label>
                                                <input type="text"
                                                value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    placeholder="Nhập tên bài viết..."
                                                    className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500" />
                                            </div>
                                            <div className="mt-3">
                                                <label>Địa điểm</label>
                                                <select value={editLocal} onChange={(e) => setEditLocal(e.target.value)} className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500">
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
                                                <label>Hình ảnh</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleEditFileChange}
                                                    // onChange={(e) => {
                                                    //     const files = e.target.files;
                                                    //     if (files && files.length > 0) {
                                                    //         const updatedParas = [...addPara];
                                                    //         updatedParas[index].image = files[0];
                                                    //         setAddPara(updatedParas);
                                                    //     }
                                                    // }}
                                                    className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <label>Nội dung</label>
                                                <textarea
                                                    placeholder="Nhập nội dung..."
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full h-32 mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                ></textarea>
                                            </div>
                                            <div>
                                                {editPara.map((para: any, index: any) => (
                                                    <div key={index} className="mb-6">
                                                        <div className="mt-3">
                                                            <label>Hình ảnh</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const files = e.target.files;
                                                                    if (files && files.length > 0) {
                                                                        const updatedParas = [...editPara];
                                                                        updatedParas[index].image = files[0];
                                                                        setEditPara(updatedParas);
                                                                    }
                                                                }}
                                                                className="w-full mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <label>Nội dung</label>
                                                            <textarea
                                                                placeholder="Nhập..."
                                                                value={para.content}
                                                                onChange={(e) => {
                                                                    const updatedParas = [...editPara];
                                                                    updatedParas[index].content = e.target.value;
                                                                    setEditPara(updatedParas);
                                                                }}
                                                                className="w-full h-32 mt-2 py-1 px-2 border-[1px] border-solid border-[#ccc] rounded-md focus:outline-blue-500"
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[20%]"></div>
                                    <div className="w-[40%] h-[550px]">
                                        <p className="text-[1.25rem] my-3 font-semibold">Xem trước</p>
                                        <div className="w-full h-full border-[1px] border-solid border-[#ccc] rounded-md overflow-y-auto">
                                            <p className="text-[1.25rem] font-semibold mt-5 text-center">{editTitle}</p>
                                            <p className="text-center font-semibold"><FontAwesomeIcon className="mr-2 italic text-blue-500" icon={faLocationDot} />{editLocal}</p>
                                            <div className="flex items-center ml-[5%] mt-5">
                                                <div className="w-[15%]">
                                                    <Image
                                                        loading="lazy"
                                                        className="w-[60px] h-[60px] rounded-[50%] border-[1px] border-solid border-[#ccc]"
                                                        alt="Images Admin"
                                                        src={editAdminPath}
                                                        width={50}
                                                        height={50}
                                                    />
                                                </div>
                                                <div className="w-[40%]">
                                                    <p className="text-[1.1rem] font-bold">{editAdminName}</p>
                                                    <p className="flex items-center text-[1rem]">
                                                        <FontAwesomeIcon
                                                            className="text-[.3rem] text-[#777] mr-2"
                                                            icon={faCircle}
                                                        />{" "}
                                                        {formatDate((new Date()).toString())}
                                                    </p>
                                                </div>
                                            </div>
                                            <Image loading="lazy" width={500} height={250} alt={`Uploaded`} className="px-4 pt-4 w-full rounded-md object-cover h-[200px]" src={editImage} />
                                            <p className="mt-1 text-[.9rem] text-center italic px-3 mb-10 break-words">
                                                {editContent}
                                            </p>
                                            {editPara && editPara.map((para: any, index: number) => (
                                                <div key={index} className="px-4 mb-4">
                                                    {para.image && (
                                                        <Image
                                                            loading="lazy"
                                                            className="w-full rounded-md object-cover h-[200px] mb-2"
                                                            alt={`Uploaded ${index}`}
                                                            src={para.image}
                                                            width={500}
                                                            height={250}
                                                        />
                                                    )}
                                                    {para.content && (
                                                        <p className="text-[.9rem] italic break-words">{para.content}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-3 gap-10 my-3">
                                        <button
                                            onClick={() => setEditOpen(false)}
                                            className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
                                        >
                                            Xóa bài viết
                                        </button>
                                        <button
                                            onClick={handleEdit}
                                            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                                        >
                                            Lưu thay đổi
                                        </button>
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

export default ManageBlog;