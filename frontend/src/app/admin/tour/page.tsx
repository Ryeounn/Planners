import { Metadata } from "next";
import Tourist from "./tour";

export const metadata: Metadata ={
    title: 'Quản lý du lịch'
}

const Tour = () =>{
    return(
        <div className="">
            <Tourist/>
        </div>
    )
}

export default Tour;