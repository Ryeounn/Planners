import { Metadata } from "next";
import ManageUser from "./user";

export const metadata: Metadata ={
    title: 'Quản lý người dùng'
}

const User = () =>{
    return(
        <div className="">
            <ManageUser/>
        </div>
    )
}

export default User;