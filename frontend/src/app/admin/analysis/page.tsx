import { Metadata } from "next";
import Analytic from "./analytic";


export const metadata: Metadata = {
    title: 'Quản lý bài viết',
    description: 'Manage Planners website'
}

const Analysis = () =>{
    return(
        <div className="">
            <Analytic/>
        </div>
    )
}

export default Analysis;