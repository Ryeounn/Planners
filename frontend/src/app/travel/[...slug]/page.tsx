import { Metadata } from "next";
import TravelDetail from "./detail";

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
    if (!params.slug || params.slug.length === 0) {
        return {
            title: 'Tour Not Found',
            description: 'Details not available',
        };
    }
    
    const slug = params.slug[0];
    const tourname = slug.split('-').slice(0, -1).join('-');
    return {
        title: `Tour ${tourname}`,
        description: `Tour ${tourname} details page`,
    };
}

export default function TravelPage({ params }: { params: { slug: string[] } }){
    return (
        <div>
            <TravelDetail params={params}/>
        </div>
    )
}