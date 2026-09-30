"use client";

import { useState } from "react";
import Link from "next/link";

const translations = {
    id: {
        back: "← Kembali ke Kalkulator",
        title: "Kebijakan Privasi",
        intro: "Kami sangat menjaga keamanan privasi pengunjung kami. Kebijakan ini menjelaskan bagaimana kami menangani informasi Anda:",
        point1Title: "Pemrosesan Data Teks & Angka:",
        point1Desc: "Data numerik yang Anda tempelkan ke dalam alat kalkulator diproses secara real-time oleh server (API) kami semata-mata untuk menghasilkan perhitungan. Kami tidak pernah merekam, menyimpan, atau menyebarkan data tersebut ke dalam basis data atau server permanen apa pun setelah sesi Anda selesai.",
        point2Title: "Penggunaan Cookies & Google AdSense:",
        point2Desc: "Situs ini menggunakan layanan pihak ketiga, termasuk Google AdSense untuk menampilkan iklan, dan Google Analytics untuk memantau lalu lintas situs. Vendor pihak ketiga ini (termasuk Google) menggunakan cookies untuk menayangkan iklan berdasarkan riwayat kunjungan Anda ke situs ini atau situs web lain di internet.",
        point3Title: "Penyisihan Iklan (Opt-Out):",
        point3Desc: "Pengguna dapat menyisih dari penggunaan cookies untuk iklan hasil personalisasi dengan mengunjungi Pengaturan Iklan Google. Anda juga dapat memblokir cookies melalui preferensi pengaturan browser Anda masing-masing."
    },
    en: {
        back: "← Back to Calculator",
        title: "Privacy Policy",
        intro: "We are committed to safeguarding our visitors' privacy. This policy outlines how we handle your information:",
        point1Title: "Data Processing:",
        point1Desc: "The numerical data you paste into our calculators is processed in real-time by our server (API) strictly to generate calculations. We never log, store, or share this data in any database or permanent server once your session ends.",
        point2Title: "Cookies & Google AdSense:",
        point2Desc: "This site uses third-party services, including Google AdSense to serve ads and Google Analytics to monitor traffic. These third-party vendors (including Google) use cookies to serve ads based on your prior visits to this website or other websites on the internet.",
        point3Title: "Advertising Opt-Out:",
        point3Desc: "Users may opt out of personalized advertising by visiting Google Ads Settings. You can also disable or manage cookies entirely through your individual browser settings."
    }
};

export default function PrivacyPolicy() {
    const [lang, setLang] = useState<"id" | "en">("id");
    const t = translations[lang];

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto font-sans text-gray-800">
            {/* Header dengan Navigasi dan Toggle Bahasa */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <Link href="/" className="text-blue-600 hover:underline font-medium">
                    {t.back}
                </Link>
                <button
                    onClick={() => setLang(lang === "id" ? "en" : "id")}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold transition-colors"
                >
                    {lang === "id" ? "🇬🇧 English" : "🇮🇩 Indonesia"}
                </button>
            </div>

            {/* Konten Utama */}
            <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
            <p className="mb-6 leading-relaxed text-gray-700">{t.intro}</p>

            <ul className="space-y-6 list-disc pl-5 text-gray-700">
                <li className="leading-relaxed">
                    <strong className="text-gray-900">{t.point1Title}</strong> {t.point1Desc}
                </li>
                <li className="leading-relaxed">
                    <strong className="text-gray-900">{t.point2Title}</strong> {t.point2Desc}
                </li>
                <li className="leading-relaxed">
                    <strong className="text-gray-900">{t.point3Title}</strong> {t.point3Desc}
                </li>
            </ul>
        </div>
    );
}