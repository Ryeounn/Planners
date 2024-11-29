import { Metadata } from "next";
import WishListDetail from "./detail";

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
    if (!params.slug || params.slug.length === 0) {
        return {
            title: 'Group Wishlist Not Found',
            description: 'Details not available',
        };
    }
    
    const slug = params.slug[0];
    const tourname = slug.split('-').slice(0, -1).join('-');
    return {
        title: `Group ${tourname}`,
        description: `Group ${tourname} details page`,
    };
}

export default function WishlistPage({ params }: { params: { slug: string[] } }){
    return (
        <div>
            <WishListDetail params={params}/>
        </div>
    )
}