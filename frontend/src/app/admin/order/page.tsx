import { Metadata } from "next";
import ManageOrder from "./order";

export const metadata: Metadata ={
    title: 'Quản lý đơn hàng'
}

const Order = () =>{
    return(
        <div className="">
            <ManageOrder/>
        </div>
    )
}

export default Order;