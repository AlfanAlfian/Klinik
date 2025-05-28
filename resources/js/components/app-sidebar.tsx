import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Archive, LayoutGrid, MapPin, Notebook, User, User2 } from 'lucide-react';
import AppLogo from './app-logo';

interface User {
    id: number;
    access: string;
}

interface PageProps {
    auth: {
        user: User | null;
    };
    errors?: Record<string, string[]>;
    deferred?: Record<string, string[]> | undefined;
}

export function AppSidebar() {
    const { auth } = usePage().props as unknown as PageProps;
    const userAccessLevel = auth.user?.access || '';

    const platformNavItems: NavItem[] = [
        {
            title: 'Home',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const managementNavItems: NavItem[] = [
        {
            title: 'Manage Products',
            href: '/products',
            icon: Archive,
        },
        {
            title: 'Manage Wilayah',
            href: '/wilayahs',
            icon: MapPin,
        },
        {
            title: 'Manage Users',
            href: '/users',
            icon: User2,
        },
        {
            title: 'Manage Pegawai',
            href: '/pegawais',
            icon: User,
        },
        {
            title: 'Manage Tindakan',
            href: '/tindakans',
            icon: Notebook,
        },
    ];

    const kunjunganNavItems: NavItem[] = [
        {
            title: 'Menu Kunjungan',
            href: '/kunjungans',
            icon: User,
        },
    ];

    const pasienNavItems: NavItem[] = [
        {
            title: 'Menu Pasien',
            href: '/pasiens',
            icon: User2,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={platformNavItems} groupLabel="" />

                {userAccessLevel === 'admin' && <NavMain items={managementNavItems} groupLabel="Management" />}

                {userAccessLevel === 'kasir' && <NavMain items={kunjunganNavItems} groupLabel="Transaksi" />}

                {userAccessLevel === 'dokter' && <NavMain items={kunjunganNavItems} groupLabel="Pemeriksaan" />}

                {userAccessLevel === 'petugas' && <NavMain items={pasienNavItems} groupLabel="Pendaftaran" />}
            </SidebarContent>

            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}
