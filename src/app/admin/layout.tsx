"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        isAdmin().then(ok => {
            if (!ok) router.replace('/feed');
            else setChecked(true);
        });
    }, [router]);

    if (!checked) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                ...
            </div>
        );
    }

    return <>{children}</>;
}
