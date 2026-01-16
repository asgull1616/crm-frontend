'use client'

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/shared/header/Header";
import NavigationManu from "@/components/shared/navigationMenu/NavigationMenu";
import SupportDetails from "@/components/supportDetails";
import useBootstrapUtils from "@/hooks/useBootstrapUtils";

export default function DuplicateLayout({ children }) {
    const pathName = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useBootstrapUtils(pathName);

    // 🔐 SADECE CLIENT TAM HAZIR OLUNCA ÇALIŞ
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const token = sessionStorage.getItem('accessToken');
        console.log('🔐 DUPLICATE TOKEN AFTER MOUNT:', token);

        if (!token) {
            router.push('/authentication/login/minimal');
        }
    }, [mounted, router]);

    // ❗ HAZIR OLMADAN HİÇBİR ŞEY RENDER ETME
    if (!mounted) return null;

    return (
        <>
            <Header />
            <NavigationManu />
            <main className="nxl-container">
                <div className="nxl-content">
                    {children}
                </div>
            </main>
            <SupportDetails />
        </>
    );
}
