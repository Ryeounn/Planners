import { Metadata } from "next";
import ManageSchedule from "./schedule";


export const metadata: Metadata ={
    title: 'Quản lý lịch trình'
}

const Schedule = () =>{
    return(
        <div className="">
            <ManageSchedule/>
        </div>
    )
}

export default Schedule;