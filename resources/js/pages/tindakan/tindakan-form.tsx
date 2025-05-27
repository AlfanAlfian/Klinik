import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function WilayahForm({ ...props }) {
    const { tindakan, isEdit } = props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} Tindakan`,
            href: route('tindakans.index'),
        },
    ];

    const { data, setData, post, processing, errors, reset, put } = useForm({
        nama_tindakan: tindakan?.nama_tindakan || '',
        tarif: tindakan?.tarif || '',
        created_at: tindakan?.created_at || '',
        id: tindakan?.id || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            if (tindakan && tindakan.id !== undefined) {
                put(route('tindakans.update', tindakan.id), {
                    onSuccess: () => console.log('Updated successfully'),
                });
            } else {
                console.error('tindakan or tindakans.id is undefined');
            }
        } else {
            post(route('tindakans.store'), {
                onSuccess: () => console.log('Created successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Tindakan`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="item-center text-md flex w-fit cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        href={route('tindakans.index')}
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Update' : 'Create'} Tindakan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} autoComplete="off" className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="nama_tindakan">Nama Tindakan</label>
                                    <Input
                                        id="nama_tindakan"
                                        name="nama_tindakan"
                                        value={data.nama_tindakan}
                                        onChange={(e) => setData('nama_tindakan', e.target.value)}
                                        type="text"
                                        placeholder="Periksa Umum"
                                        autoFocus
                                    />
                                    <InputError message={errors.nama_tindakan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tarif">Tarif</label>
                                    <Input
                                        id="tarif"
                                        name="tarif"
                                        value={data.tarif}
                                        onChange={(e) => setData('tarif', e.target.value)}
                                        type="text"
                                        placeholder="100000"
                                    />
                                    <InputError message={errors.tarif} />
                                </div>

                                <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Tindakan' : 'Create Tindakan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
