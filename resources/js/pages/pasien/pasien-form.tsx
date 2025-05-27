import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function PasienForm({ ...props }) {
    const { pegawaiOption = [], isEdit, pasien } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} Pasien`,
            href: route('pasiens.index'),
        },
    ];

    const { data, setData, post, processing, errors, reset, put } = useForm({
        nama: pasien?.nama || '',
        nik: pasien?.nik || '',
        telepon: pasien?.telepon || '',
        jenis_kunjungan: pasien?.jenis_kunjungan || '',
        pegawai_id: pasien?.pegawai_id || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            if (pasien && pasien.id !== undefined) {
                put(route('pasiens.update', pasien.id), {
                    onSuccess: () => console.log('Updated successfully'),
                });
            }
        } else {
            post(route('pasiens.store'), {
                onSuccess: () => console.log('Created successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Pasien`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="item-center text-md flex w-fit cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        href={route('pasiens.index')}
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Update' : 'Create'} Pasien</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} autoComplete="off" className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="nama">Nama Pasien</label>
                                    <Input
                                        id="nama"
                                        name="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        type="text"
                                        placeholder="John Doe"
                                        autoFocus
                                    />
                                    <InputError message={errors.nama} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="nik">NIK</label>
                                    <Input
                                        id="nik"
                                        name="nik"
                                        value={data.nik}
                                        onChange={(e) => {
                                            // Only allow numbers and limit to 16 digits
                                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
                                            setData('nik', value);
                                        }}
                                        type="text"
                                        maxLength={16}
                                        placeholder="3201234567890001"
                                    />
                                    <InputError message={errors.nik} />
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
                                    />
                                    <InputError message={errors.telepon} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="jenis_kunjungan">Jenis Kunjungan</label>
                                    <Select
                                        name="jenis_kunjungan"
                                        onValueChange={(value) => setData('jenis_kunjungan', value)}
                                        value={data.jenis_kunjungan}
                                    >
                                        <SelectTrigger className="w-full" id="jenis_kunjungan">
                                            <SelectValue placeholder="Pilih jenis kunjungan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BPJS">BPJS</SelectItem>
                                            <SelectItem value="Umum">Umum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.jenis_kunjungan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="pegawai_id">Dokter</label>
                                    <Select name="pegawai_id" onValueChange={(value) => setData('pegawai_id', value)} value={data.pegawai_id}>
                                        <SelectTrigger className="w-full" id="pegawai_id">
                                            <SelectValue placeholder="Pilih dokter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pegawaiOption.map((dokter: { id: number; nama: string }) => (
                                                <SelectItem key={dokter.id} value={String(dokter.id)}>
                                                    {dokter.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.pegawai_id} />
                                </div>

                                <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Pasien' : 'Create Pasien'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
