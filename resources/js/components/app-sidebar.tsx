import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Archive, LayoutGrid, MapPin, Notebook, User, User2 } from 'lucide-react';
import React from 'react';
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
    const userAccessLevel = auth.user?.access || 'kasir';

    const platformNavItems: NavItem[] = [
        {
            title: 'Home',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const productNavItems: NavItem[] = [
        {
            title: 'Manage Products',
            href: '/products',
            icon: Archive,
        },
    ];

    const wilayahNavItems: NavItem[] = [
        {
            title: 'Manage Wilayah',
            href: '/wilayahs',
            icon: MapPin,
        },
    ];

    const userNavItems: NavItem[] = [
        {
            title: 'Manage User',
            href: '/users',
            icon: User2,
        },
    ];

    const pegawaiNavItems: NavItem[] = [
        {
            title: 'Manage Pegawai',
            href: '/pegawais',
            icon: User,
        },
    ];

    const tindakanNavItems: NavItem[] = [
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
                {userAccessLevel == 'admin' && (
                    <React.Fragment key="manage-nav">
                        <NavMain items={[...kunjunganNavItems]} groupLabel="Menu" />
                        <NavMain
                            items={[...productNavItems, ...wilayahNavItems, ...userNavItems, ...pegawaiNavItems, ...tindakanNavItems]}
                            groupLabel="Manage"
                        />
                    </React.Fragment>
                )}
            </SidebarContent>

            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}
