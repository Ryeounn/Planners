import { Metadata } from "next";
import DashBoard from "./dashboard";

export const metadata: Metadata = {
    title: 'Bảng điều khiển',
    description: 'Manage Planners website'
}

const DashBoardMain = () =>{
    return(
        <div className="">
            <DashBoard/>
        </div>
    )
}

export default DashBoardMain;