import { Suspense } from 'react';

export default async function TestCategoryPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold mb-4">Test Category Filter</h1>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h2 className="font-bold mb-2">Received Search Params:</h2>
                <pre className="text-sm">{JSON.stringify(params, null, 2)}</pre>
            </div>

            <div className="space-y-2">
                <p><strong>category param:</strong> {params.category || 'NOT SET'}</p>
                <p><strong>Type:</strong> {typeof params.category}</p>
            </div>

            <div className="mt-8">
                <h2 className="font-bold mb-2">Test Links:</h2>
                <div className="space-x-4">
                    <a href="/test-category?category=guayeras" className="text-blue-600 underline">
                        Test Guayeras
                    </a>
                    <a href="/test-category?category=medias-futsal" className="text-blue-600 underline">
                        Test Medias
                    </a>
                    <a href="/test-category?category=balones-futsal" className="text-blue-600 underline">
                        Test Balones
                    </a>
                </div>
            </div>
        </div>
    );
}
