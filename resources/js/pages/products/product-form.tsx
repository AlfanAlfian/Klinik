import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function ProductForm({ ...props }) {
    const { product, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} Product`,
            href: route('products.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset, put } = useForm({
        name: product?.name || '',
        price: product?.price || '',
        stock: product?.stock || '',
        featured_image: null as File | null,
        created_at: product?.created_at || '',
        category: product?.category || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            put(route('products.update', product.id), {
                onSuccess: () => console.log('Form submitted'),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => console.log('Form submitted'),
            });
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('featured_image', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Update' : 'Create'} Product`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="item-center text-md flex w-fit cursor-pointer rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                        href={route('products.index')}
                    >
                        <ArrowLeft className="me-2" /> Back
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Update' : 'Create'} Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} autoComplete="off" className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="name">Product Name</label>
                                    <Input
                                        onChange={(e) => setData('name', e.target.value)}
                                        value={data.name}
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Product Name"
                                        autoFocus
                                        tabIndex={1}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="category">Category</label>
                                    <Select name="category" onValueChange={(value) => setData('category', value)} value={data.category}>
                                        <SelectTrigger className="w-full" tabIndex={3}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tablet">Tablet</SelectItem>
                                            <SelectItem value="Capsul">Capsul</SelectItem>
                                            <SelectItem value="Botol">Botol</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="price">Price</label>
                                    <Input
                                        onChange={(e) => setData('price', e.target.value)}
                                        value={data.price}
                                        type="text"
                                        id="price"
                                        name="price"
                                        tabIndex={4}
                                        placeholder="Prduct Price"
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="featured_image">Freatured Image (optional) </label>
                                    <Input
                                        onChange={handleFile}
                                        type="file"
                                        id="featured_image"
                                        name="featured_image"
                                        tabIndex={6}
                                        placeholder="Featured Image"
                                    />
                                    <InputError message={errors.featured_image} />
                                </div>

                                {isEdit && product.featured_image && (
                                    <div className="grid gap-2">
                                        <label htmlFor="featured_image">Current Freatured Image</label>
                                        <img
                                            src={`/storage/${product.featured_image}`}
                                            alt="Featured Image"
                                            className="h-40 w-50 rounded-lg shadow-md"
                                        />
                                    </div>
                                )}

                                <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={4}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Product
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
