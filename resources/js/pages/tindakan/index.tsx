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
        href: '/tindakans',
    },
    {
        title: 'Manage Tindakan',
        href: '/tindakans',
    },
];

interface Tindakan {
    id: number;
    nama_tindakan: string;
    tarif: string;
    created_at: string;
}

export default function Index({ ...props }: { tindakans: Tindakan[] }) {
    const { tindakans } = props;
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
            <Head title="Manage Tindakan" />
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
                        href={route('tindakans.create')}
                    >
                        <PlusCircle className="me-2" /> Add Tindakan{' '}
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Nama Tindakan</th>
                                <th className="border p-4">Tarif</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tindakans.length > 0 ? (
                                tindakans.map((tindakan, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">{tindakan.nama_tindakan}</td>
                                        <td className="border px-4 py-2 text-center">{tindakan.tarif}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <IconButtonWithTooltip tooltip="Edit Tindakan">
                                                <Link
                                                    as="button"
                                                    className="ms-2 cursor-pointer rounded-lg bg-green-500 p-2 text-white hover:opacity-90"
                                                    href={route('tindakans.edit', tindakan.id)}
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                            </IconButtonWithTooltip>

                                            <IconButtonWithTooltip tooltip="Delete Tindakan">
                                                <Button
                                                    onClick={() => {
                                                        if (confirm('Are you sure delete this tindakan?')) {
                                                            router.delete(route('tindakans.destroy', tindakan.id), {
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
                                        No Tindakans Found
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
