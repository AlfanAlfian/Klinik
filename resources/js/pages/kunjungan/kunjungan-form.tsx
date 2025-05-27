import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

interface Props {
    kunjungan?: any;
    pasienOption: { id: number; nama: string }[];
    productOption: { id: number; nama: string }[];
    isEdit?: boolean;
}

export default function KunjunganForm({ ...props }: Props) {
    const { kunjungan, pasienOption = [], productOption = [], isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} Kunjungan`,
            href: route('kunjungans.index'),
        },
    ];

    const { data, setData, post, processing, errors, put } = useForm({
        pasien_id: kunjungan?.pasien_id || '',
        tindakan: kunjungan?.tindakan || '',
        tarif_tindakan: kunjungan?.tarif_tindakan || '',
        product_id: kunjungan?.product_id || '',
        tanggal_kunjungan: kunjungan?.tanggal_kunjungan || '',
        tagihan: kunjungan?.tagihan || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            put(route('kunjungans.update', kunjungan.id));
        } else {
            post(route('kunjungans.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Kunjungan`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="item-center text-md flex w-fit cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        href={route('kunjungans.index')}
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Update' : 'Create'} Data Kunjungan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="pasien_id">Nama Pasien</label>
                                    <Select name="pasien_id" onValueChange={(value) => setData('pasien_id', value)} value={data.pasien_id}>
                                        <SelectTrigger className="w-full" id="pasien_id">
                                            <SelectValue placeholder="Pilih pasien" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pasienOption.map((pasien) => (
                                                <SelectItem key={pasien.id} value={String(pasien.id)}>
                                                    {pasien.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.pasien_id} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tindakan">Tindakan</label>
                                    <Input
                                        id="tindakan"
                                        name="tindakan"
                                        value={data.tindakan}
                                        onChange={(e) => setData('tindakan', e.target.value)}
                                        type="text"
                                        placeholder="Tindakan medis"
                                    />
                                    <InputError message={errors.tindakan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tarif_tindakan">Tarif Tindakan</label>
                                    <Input
                                        id="tarif_tindakan"
                                        name="tarif_tindakan"
                                        value={data.tarif_tindakan}
                                        onChange={(e) => setData('tarif_tindakan', e.target.value)}
                                        type="number"
                                        placeholder="0"
                                    />
                                    <InputError message={errors.tarif_tindakan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="product_id">Product</label>
                                    <Select name="product_id" onValueChange={(value) => setData('product_id', value)} value={data.product_id}>
                                        <SelectTrigger className="w-full" id="product_id">
                                            <SelectValue placeholder="Pilih product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productOption.map((product) => (
                                                <SelectItem key={product.id} value={String(product.id)}>
                                                    {product.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.product_id} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tanggal_kunjungan">Tanggal Kunjungan</label>
                                    <Input
                                        id="tanggal_kunjungan"
                                        name="tanggal_kunjungan"
                                        value={data.tanggal_kunjungan}
                                        onChange={(e) => setData('tanggal_kunjungan', e.target.value)}
                                        type="date"
                                    />
                                    <InputError message={errors.tanggal_kunjungan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tagihan">Tagihan</label>
                                    <Input
                                        id="tagihan"
                                        name="tagihan"
                                        value={data.tagihan}
                                        onChange={(e) => setData('tagihan', e.target.value)}
                                        type="number"
                                        placeholder="0"
                                    />
                                    <InputError message={errors.tagihan} />
                                </div>

                                <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Saving...' : isEdit ? 'Update Kunjungan' : 'Create Kunjungan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
