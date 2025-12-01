import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle /producto/:slug -> /:slug
    const singularMatch = pathname.match(/^\/producto\/([^/]+)$/);
    if (singularMatch) {
        const slug = singularMatch[1];
        const url = request.nextUrl.clone();
        url.pathname = `/${slug}`;
        return NextResponse.redirect(url, 301);
    }

    // Handle /productos/:category/:subcategory/:slug or /productos/:category/:slug
    // We extract the last segment as the slug
    if (pathname.startsWith('/productos/') && pathname.split('/').length > 2) {
        const parts = pathname.split('/');
        const slug = parts[parts.length - 1];
        if (slug && slug !== 'page') { // Avoid redirecting pagination if it exists
            const url = request.nextUrl.clone();
            url.pathname = `/${slug}`;
            return NextResponse.redirect(url, 301);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/producto/:path*',
        '/productos/:path*',
    ],
};
