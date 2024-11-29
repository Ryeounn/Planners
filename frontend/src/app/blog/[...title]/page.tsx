import { Metadata } from 'next';
import BlogDetail from './detail';
export async function generateMetadata({ params }: { params: { title: string } }): Promise<Metadata> {
    return {
        title: `Blog ${params.title}`,
        description: `Blog ${params.title} details page`,
    };
}

export default function BlogPage({ params }: { params: { slug: string[] } }) {
    return (
        <div>
            <BlogDetail params={params} />
        </div>
    );
}
