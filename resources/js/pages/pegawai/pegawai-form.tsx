import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function PegawaiForm({ ...props }) {
    const { pegawai, isEdit, wilayahOptions = [] } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} Pegawai`,
            href: route('pegawais.index'),
        },
    ];

    const { data, setData, post, processing, errors, reset, put } = useForm({
        nama: pegawai?.nama || '',
        jabatan: pegawai?.jabatan || '',
        wilayah_id: pegawai?.wilayah_id || '',
        telepon: pegawai?.telepon || '',
        id: pegawai?.id || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            if (pegawai && pegawai.id !== undefined) {
                put(route('pegawais.update', pegawai.id), {
                    onSuccess: () => console.log('Updated successfully'),
                });
            } else {
                console.error('pegawai or pegawais.id is undefined');
            }
        } else {
            post(route('pegawais.store'), {
                onSuccess: () => console.log('Created successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Pegawai`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="item-center text-md flex w-fit cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        href={route('pegawais.index')}
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Update' : 'Create'} Pegawai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} autoComplete="off" className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="nama">Nama Pegawai</label>
                                    <Input
                                        id="nama"
                                        name="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        type="text"
                                        placeholder="Putra"
                                        autoFocus
                                    />
                                    <InputError message={errors.nama} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="jabatan">Jabatan</label>
                                    <Input
                                        id="jabatan"
                                        name="jabatan"
                                        value={data.jabatan}
                                        onChange={(e) => setData('jabatan', e.target.value)}
                                        type="text"
                                        placeholder="Dokter"
                                        autoFocus
                                    />
                                    <InputError message={errors.jabatan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="telepon">No Telepon</label>
                                    <Input
                                        id="telepon"
                                        name="telepon"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                        type="text"
                                        placeholder="08123456789"
                                        autoFocus
                                    />
                                    <InputError message={errors.telepon} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="wilayah_id">Provinsi Induk</label>
                                    <Select
                                        name="wilayah_id"
                                        onValueChange={(value) => setData('wilayah_id', value)}
                                        value={data.wilayah_id !== undefined && data.wilayah_id !== null ? String(data.wilayah_id) : undefined}
                                    >
                                        <SelectTrigger id="wilayah_id" className="w-full">
                                            <SelectValue placeholder="Pilih provinsi induk" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wilayahOptions.map((item: { id: number | string; nama_wilayah: string }) => (
                                                <SelectItem key={item.id} value={String(item.id)}>
                                                    {item.nama_wilayah}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.wilayah_id} />
                                </div>

                                <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Pegawai' : 'Create Pegawai'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
