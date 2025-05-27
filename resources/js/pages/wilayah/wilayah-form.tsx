import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

interface Wilayah {
    id: number | string;
    nama_wilayah: string;
    tipe: string;
    wilayah_induk_id?: number | string;
    created_at?: string;
}

interface WilayahFormProps {
    wilayah?: Wilayah;
    isEdit?: boolean;
    wilayahIndukOptions?: Wilayah[];
}

export default function WilayahForm({ wilayah, isEdit = false, wilayahIndukOptions = [] }: WilayahFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} Wilayah`,
            href: route('wilayahs.index'),
        },
    ];

    const { data, setData, post, processing, errors, reset, put } = useForm({
        nama_wilayah: wilayah?.nama_wilayah || '',
        tipe: wilayah?.tipe || '',
        wilayah_induk_id: wilayah?.wilayah_induk_id || '',
        created_at: wilayah?.created_at || '',
        id: wilayah?.id || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            if (wilayah && wilayah.id !== undefined) {
                put(route('wilayahs.update', wilayah.id), {
                    onSuccess: () => console.log('Updated successfully'),
                });
            } else {
                console.error('Wilayah or wilayahs.id is undefined');
            }
        } else {
            post(route('wilayahs.store'), {
                onSuccess: () => console.log('Created successfully'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Wilayah`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="item-center text-md flex w-fit cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        href={route('wilayahs.index')}
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Update' : 'Create'} Wilayah</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} autoComplete="off" className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="nama_wilayah">Nama Wilayah</label>
                                    <Input
                                        id="nama_wilayah"
                                        name="nama_wilayah"
                                        value={data.nama_wilayah}
                                        onChange={(e) => setData('nama_wilayah', e.target.value)}
                                        type="text"
                                        placeholder="Bandung"
                                        autoFocus
                                    />
                                    <InputError message={errors.nama_wilayah} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tipe">Tipe Wilayah</label>
                                    <Select name="tipe" onValueChange={(value) => setData('tipe', value)} value={data.tipe}>
                                        <SelectTrigger id="tipe" className="w-full" tabIndex={2}>
                                            <SelectValue placeholder="Pilih tipe wilayah" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="provinsi">Provinsi</SelectItem>
                                            <SelectItem value="kabupaten">Kabupaten</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.tipe} />
                                </div>

                                {data.tipe === 'kabupaten' && (
                                    <div className="grid gap-2">
                                        <label htmlFor="wilayah_induk_id">Provinsi Induk</label>
                                        <Select
                                            name="wilayah_induk_id"
                                            onValueChange={(value) => setData('wilayah_induk_id', value)}
                                            value={
                                                data.wilayah_induk_id !== undefined && data.wilayah_induk_id !== null
                                                    ? String(data.wilayah_induk_id)
                                                    : undefined
                                            }
                                        >
                                            <SelectTrigger id="wilayah_induk_id" className="w-full">
                                                <SelectValue placeholder="Pilih provinsi induk" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {wilayahIndukOptions.map((item) => (
                                                    <SelectItem key={item.id} value={String(item.id)}>
                                                        {item.nama_wilayah}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.wilayah_induk_id} />
                                    </div>
                                )}

                                <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Wilayah' : 'Create Wilayah'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
