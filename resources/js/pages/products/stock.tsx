import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function StockForm({ product }: { product: any }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Stock',
            href: route('products.index'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: 1,
    });

    const addStock = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.add-stock', product.id));
    };

    const removeStock = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.remove-stock', product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Stock" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link as="button" className="w-fit flex items-center bg-indigo-500 px-4 py-2 rounded-lg text-white text-md cursor-pointer hover:opacity-90" href={route('products.index')}>
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Stock - {product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="quantity">Quantity</label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', parseInt(e.target.value))}
                                        placeholder="Enter quantity"
                                    />
                                    <InputError message={errors.quantity} />
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={addStock} disabled={processing} type="button" className="bg-green-600 hover:bg-green-700">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        Tambah Stok
                                    </Button>
                                    <Button onClick={removeStock} disabled={processing} type="button" className="bg-red-600 hover:bg-red-700">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        Kurangi Stok
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
