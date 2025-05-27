import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import IconButtonWithTooltip from '@/components/ui/custom-tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, PlusCircle, Trash2, Warehouse } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage',
        href: '/products',
    },
    {
        title: 'Manage Product',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    featured_image: string;
    created_at: string;
    category: string;
}

export default function Index({ ...props }: { products: Product[] }) {
    const { products } = props;
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
            <Head title="Manage Product" />
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
                        href={route('products.create')}
                    >
                        <PlusCircle className="me-2" /> Add Product{' '}
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Name</th>
                                <th className="border p-4">Price</th>
                                <th className="border p-4">Stock</th>
                                <th className="border p-4">Category</th>
                                <th className="border p-4">Featured Image</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">{product.name}</td>
                                        <td className="border px-4 py-2 text-center">Rp {product.price}</td>
                                        <td className="border px-4 py-2 text-center">{product.stock}</td>
                                        <td className="border px-4 py-2 text-center">{product.category}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {product.featured_image && (
                                                <img src={product.featured_image} alt={product.name} className="h-16 w-20 rounded-lg object-cover" />
                                            )}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <IconButtonWithTooltip tooltip="Manage Stock">
                                                <Link
                                                    as="button"
                                                    className="cursor-pointer rounded-lg bg-teal-500 p-2 text-white hover:opacity-90"
                                                    href={route('products.stock', product.id)}
                                                >
                                                    <Warehouse size={18} />
                                                </Link>
                                            </IconButtonWithTooltip>

                                            <IconButtonWithTooltip tooltip="Edit Product">
                                                <Link
                                                    as="button"
                                                    className="ms-2 cursor-pointer rounded-lg bg-green-500 p-2 text-white hover:opacity-90"
                                                    href={route('products.edit', product.id)}
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                            </IconButtonWithTooltip>

                                            <IconButtonWithTooltip tooltip="Delete Product">
                                                <Button
                                                    onClick={() => {
                                                        if (confirm('Are you sure delete this product?')) {
                                                            router.delete(route('products.destroy', product.id), {
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
                                        No Products Found
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
