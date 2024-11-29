import { Metadata } from "next";
import ManageBlog from "./blog";

export const metadata: Metadata = {
    title: 'Quản lý bài viết',
    description: 'Manage Planners website'
}

const Blog = () =>{
    return(
        <div className="">
            <ManageBlog/>
        </div>
    )
}

export default Blog;