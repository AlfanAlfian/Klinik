import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import IconButtonWithTooltip from '@/components/ui/custom-tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage',
        href: '/kunjungan',
    },
    {
        title: 'Manage Transaksi Kunjungan',
        href: '/kunjungan',
    },
];

interface Kunjungan {
    id: number;
    pasien: string;
    tindakan: string;
    product: string | null;
    tanggal_kunjungan: string;
    tagihan: number;
    total_tagihan: number;
}

export default function Index({ ...props }: { kunjungan: Kunjungan[] }) {
    const { kunjungan } = props;
    const { flash } = usePage<{ flash?: { success?: string; error?: String } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Kunjungan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && flashMessage && (
                    <Alert
                        variant={'default'}
                        className={`${flash?.success ? 'bg-green-700' : flash?.error ? 'bg-red-700' : ''} ml-auto max-w-md text-white`}
                    >
                        <AlertTitle className="font-bold">{flash.success ? 'Success' : 'Error'}</AlertTitle>
                        <AlertDescription className="text-white">{flashMessage}</AlertDescription>
                    </Alert>
                )}

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Nama Pasien</th>
                                <th className="border p-4">Tindakan</th>
                                <th className="border p-4">Product</th>
                                <th className="border p-4">Tanggal Kunjungan</th>
                                <th className="border p-4">Tagihan</th>
                                <th className="border p-4">Total Tagihan</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kunjungan.length > 0 ? (
                                kunjungan.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">{item.pasien}</td>
                                        <td className="border px-4 py-2 text-center">{item.tindakan}</td>
                                        <td className="border px-4 py-2 text-center">{item.product || '-'}</td>
                                        <td className="border px-4 py-2 text-center">{item.tanggal_kunjungan}</td>
                                        <td className="border px-4 py-2 text-center">{item.tagihan}</td>
                                        <td className="border px-4 py-2 text-center">{item.total_tagihan}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <IconButtonWithTooltip tooltip="Edit Kunjungan">
                                                <Link
                                                    as="button"
                                                    className="ms-2 cursor-pointer rounded-lg bg-green-500 p-2 text-white hover:opacity-90"
                                                    href={route('kunjungans.edit', item.id)}
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                            </IconButtonWithTooltip>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-md py-4 text-center font-bold">
                                        No Kunjungan Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
