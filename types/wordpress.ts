
export interface WPMediaSizes {
    thumbnail?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
    };
    medium?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
    };
    full?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
    };
    [key: string]: any; // Para tamaños custom
}

export interface WPMedia {
    id: number;
    date: string;
    slug: string;
    type: "attachment";
    title: {
        rendered: string;
    };
    caption: {
        rendered: string;
    };
    alt_text: string;
    media_type: "image" | "file";
    mime_type: string;
    media_details: {
        width: number;
        height: number;
        file: string;
        sizes: WPMediaSizes;
    };
    source_url: string;
    author: number;
}

export interface WPCategory {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: "category";
    parent: number;
}

export interface WPTag {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: "post_tag";
}

export interface WPAuthor {
    id: number;
    name: string;
    url: string;
    description: string;
    link: string;
    slug: string;
    avatar_urls?: Record<string, string>;
}

export interface WPPost {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: "publish" | "future" | "draft" | "pending" | "private";
    type: "post";
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    excerpt: {
        rendered: string;
        protected: boolean;
    };
    author: number;
    featured_media: number;
    comment_status: "open" | "closed";
    ping_status: "open" | "closed";
    sticky: boolean;
    template: string;
    format: "standard" | "aside" | "image" | "video" | "quote" | "link" | "gallery" | "audio";
    meta: any[];
    categories: number[];
    tags: number[];
    _embedded?: {
        author?: WPAuthor[];
        "wp:featuredmedia"?: WPMedia[];
        "wp:term"?: Array<WPCategory[] | WPTag[]>;
    };
}
