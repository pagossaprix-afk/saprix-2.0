"use client";

import { Star } from "lucide-react";
import Image from "next/image";

interface GoogleReview {
    id: number;
    author: string;
    rating: number;
    date: string;
    content: string;
    profile_photo_url?: string;
}

const MOCK_REVIEWS: GoogleReview[] = [
    {
        id: 1,
        author: "Dylan Camilo Acosta Pico",
        rating: 5,
        date: "Hace un mes",
        content: "La mejor calidad en ropa deportiva 💯⚽",
    },
    {
        id: 2,
        author: "Anderson Quintero",
        rating: 5,
        date: "Hace un año",
        content: "Es una gran tienda hasta me arriesgo diciendo que puede ser la mejor de micro fútbol-fultsal de todo Bogotá ⚽⚽⚽⚽⚽🥇",
    },
    {
        id: 3,
        author: "LUZ SANTA",
        rating: 5,
        date: "Hace 4 meses",
        content: "Buen sitio",
    }
];

export default function GoogleReviews() {
    // URL to write a review - using the specific search query provided by the user
    const WRITE_REVIEW_URL = "https://www.google.com/search?sca_esv=3dbed19d9671262c&rlz=1C1VDKB_esAR1021AR1021&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E4Do8VRbpqQ_oTs_cwhGVoSo0thA4PE2q-CLrPzFvgR8gntYZO9hSy_AMRv4wmokz5VP9B0IqU-gANUAHNj4YSvUwk5q&q=SAPRIX+Opiniones&sa=X&ved=2ahUKEwiSu_7934uRAxUnSDABHUGAPTkQ0bkNegQIOBAE&biw=1600&bih=765&dpr=1";

    return (
        <div className="bg-white border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 border border-gray-100 -skew-x-6">
                        {/* Google G Logo SVG */}
                        <svg viewBox="0 0 24 24" className="w-8 h-8 skew-x-6" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Opiniones en Google</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">4.8</span>
                            <div className="flex text-[#FBBC05]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 fill-current`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">(133 reseñas)</span>
                        </div>
                    </div>
                </div>

                <a
                    href={WRITE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium transition-colors flex items-center gap-2 -skew-x-6"
                >
                    <span className="skew-x-6">Escribir una reseña</span>
                </a>
            </div>

            <div className="grid gap-6">
                {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0 -skew-x-6">
                                <span className="skew-x-6">{review.author.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-sm text-gray-900">{review.author}</h4>
                                    <span className="text-xs text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex text-[#FBBC05] mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center skew-x-6">
                <a
                    href={WRITE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a73e8] font-medium text-sm hover:underline"
                >
                    Ver todas las reseñas en Google Maps
                </a>
            </div>
        </div>
    );
}
