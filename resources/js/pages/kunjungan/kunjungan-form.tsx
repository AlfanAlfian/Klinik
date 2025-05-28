import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    kunjungan?: {
        id: number;
        pasien_id: number;
        pasien_nama: string;
        tindakan: string;
        tarif_tindakan: number;
        product_ids: string[];
        product_names: string[];
        tanggal_kunjungan: string;
        tagihan: number;
        total_tagihan: number;
        userRole?: string;
    };
    tindakanOption: {
        id: number;
        nama_tindakan: string;
        tarif: number;
    }[];
    productOption: {
        id: number;
        name: string;
        price: number;
        stock: number;
    }[];
    isEdit?: boolean;
}

export default function KunjunganForm({ kunjungan, tindakanOption = [], productOption = [], isEdit }: Props) {
    const [selectedTindakan, setSelectedTindakan] = useState<number>(Number(kunjungan?.tarif_tindakan) || 0);
    const [selectedProducts, setSelectedProducts] = useState<string[]>(kunjungan?.product_ids || []);
    const [open, setOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kunjungan',
            href: route('kunjungans.index'),
        },
        {
            title: `${isEdit ? 'Update' : 'Create'} Kunjungan`,
            href: '#',
        },
    ];

    const { data, setData, processing, errors, put } = useForm({
        pasien_id: kunjungan?.pasien_id || '',
        tindakan: kunjungan?.tindakan || '',
        tarif_tindakan: kunjungan?.tarif_tindakan || 0,
        product_ids: kunjungan?.product_ids || [],
        tanggal_kunjungan: kunjungan?.tanggal_kunjungan || '',
        tagihan: kunjungan?.tagihan || 0,
        total_tagihan: kunjungan?.total_tagihan || 0,
    });

    useEffect(() => {
        // Calculate tindakan price
        const tindakanPrice = Number(selectedTindakan);

        // Calculate total product prices
        const productsTotal = selectedProducts.reduce((total, productId) => {
            const product = productOption.find((p) => String(p.id) === productId);
            return total + (product ? Number(product.price) : 0);
        }, 0);

        // Set the total
        const totalTagihan = tindakanPrice + productsTotal;

        // Update form data
        setData((data) => ({
            ...data,
            tarif_tindakan: tindakanPrice,
            total_tagihan: totalTagihan,
        }));

        setData((prevData) => ({
            ...prevData,
            product_ids: selectedProducts,
        }));
    }, [selectedTindakan, selectedProducts, productOption, setData]);

    const handleTindakanChange = (tindakanId: string) => {
        const tindakan = tindakanOption.find((t) => String(t.id) === tindakanId);
        if (tindakan) {
            setData('tindakan', tindakan.nama_tindakan);
            setSelectedTindakan(Number(tindakan.tarif));
        }
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProducts((current) => {
            if (current.includes(productId)) {
                return current.filter((id) => id !== productId);
            }
            return [...current, productId];
        });
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Update the form data before submission
        setData((prevData) => ({
            ...prevData,
            product_ids: selectedProducts, // Ensure product_ids is always set
        }));

        if (isEdit && kunjungan) {
            put(route('kunjungans.update', kunjungan.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false); // Close product selector after successful update
                },
                onError: (errors) => {
                    console.error('Update failed:', errors);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Kunjungan`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        className="text-md flex w-fit items-center rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
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
                                    <label htmlFor="pasien">Nama Pasien</label>
                                    <Input id="pasien" value={kunjungan?.pasien_nama || ''} disabled className="bg-gray-100" />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tindakan">Tindakan</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {data.tindakan || 'Pilih tindakan...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search tindakan..." />
                                                <CommandEmpty>No tindakan found.</CommandEmpty>
                                                <CommandGroup>
                                                    {tindakanOption.map((tindakan) => (
                                                        <CommandItem key={tindakan.id} value={String(tindakan.id)} onSelect={handleTindakanChange}>
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.tindakan === tindakan.nama_tindakan ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {tindakan.nama_tindakan}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.tindakan} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="products">Products/Obat</label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                                                {selectedProducts.length > 0 ? `${selectedProducts.length} products selected` : 'Select products...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search product..." />
                                                <CommandList>
                                                    <CommandEmpty>No product found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {productOption.map((product) => (
                                                            <CommandItem
                                                                key={product.id}
                                                                value={String(product.id)}
                                                                onSelect={handleProductSelect}
                                                                disabled={product.stock === 0}
                                                            >
                                                                {product.name}
                                                                <span className="ml-2 text-sm text-gray-500">(Stok: {product.stock})</span>
                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto h-4 w-4',
                                                                        selectedProducts.includes(String(product.id)) ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.product_ids} />

                                    {/* Display selected products */}
                                    {selectedProducts.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedProducts.map((productId) => {
                                                const product = productOption.find((p) => String(p.id) === productId);
                                                return product ? (
                                                    <div key={productId} className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1">
                                                        <span>{product.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleProductSelect(productId)}
                                                            className="text-gray-500 hover:text-red-500"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="tanggal_kunjungan">Tanggal Kunjungan</label>
                                    <Input id="tanggal_kunjungan" value={data.tanggal_kunjungan} type="date" disabled className="bg-gray-100" />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="total_tagihan">Total Tagihan</label>
                                    <Input
                                        id="total_tagihan"
                                        value={`Rp ${Number(data.total_tagihan).toLocaleString('id-ID')}`}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>

                                <Button type="submit" className="mt-4 w-fit">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? 'Saving...' : 'Update Kunjungan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
