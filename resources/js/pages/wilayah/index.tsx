import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import IconButtonWithTooltip from '@/components/ui/custom-tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage',
        href: '/wilayah',
    },
    {
        title: 'Manage Wilayah',
        href: '/wilayah',
    },
];

interface Wilayah {
    id: number;
    nama_wilayah: string;
    tipe: string;
    wilayah_induk_id: string;
    induk: string;
    created_at: string;
}

export default function Index({ ...props }: { wilayahs: Wilayah[] }) {
    const { wilayahs } = props;
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
            <Head title="Manage Wilayah" />
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

                <div className="ml-auto">
                    <Link
                        className="text-md item-center flex cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        as="button"
                        href={route('wilayahs.create')}
                    >
                        <PlusCircle className="me-2" /> Add Wilayah{' '}
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Nama Wilayah</th>
                                <th className="border p-4">Tipe</th>
                                <th className="border p-4">Wilayah Induk</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wilayahs.length > 0 ? (
                                wilayahs.map((wilayah, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">{wilayah.nama_wilayah}</td>
                                        <td className="border px-4 py-2 text-center">{wilayah.tipe}</td>
                                        <td className="border px-4 py-2 text-center">{wilayah.induk || '-'}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <IconButtonWithTooltip tooltip="Edit Wilayah">
                                                <Link
                                                    as="button"
                                                    className="ms-2 cursor-pointer rounded-lg bg-green-500 p-2 text-white hover:opacity-90"
                                                    href={route('wilayahs.edit', wilayah.id)}
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                            </IconButtonWithTooltip>

                                            <IconButtonWithTooltip tooltip="Delete Wilayah">
                                                <Button
                                                    onClick={() => {
                                                        if (confirm('Are you sure delete this wilayah?')) {
                                                            router.delete(route('wilayahs.destroy', wilayah.id), {
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    className="ms-2 cursor-pointer rounded-lg bg-red-500 p-2 text-white hover:opacity-90"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </IconButtonWithTooltip>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-md py-4 text-center font-bold">
                                        No Wilayahs Found
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
