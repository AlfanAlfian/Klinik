import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function UserForm({ ...props }) {
    const { user, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Update' : 'Create'} User`,
            href: route('users.index'),
        },
    ];

    const { data, setData, post, processing, errors, reset, put } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        access: user?.access || '',
        id: user?.id || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            if (user && user.id !== undefined) {
                put(route('users.update', user.id), {
                    onSuccess: () => console.log('Updated successfully'),
                });
            } else {
                console.error('user or users.id is undefined');
            }
        } else {
            post(route('users.store'), {
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
                        href={route('users.index')}
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
                                    <label htmlFor="name">Nama User</label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        type="text"
                                        placeholder="User Name"
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        type="email"
                                        placeholder="Email@email.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password">Password</label>
                                    <Input
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        type="password"
                                        placeholder="password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password_confirmation">Konfirmasi Password</label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation || ''}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        type="password"
                                        placeholder="Ulangi password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="access">Access</label>
                                    <Select name="access" onValueChange={(value) => setData('access', value)} value={data.access}>
                                        <SelectTrigger className="w-full" tabIndex={3}>
                                            <SelectValue placeholder="Select a access" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kasir">Kasir</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="dokter">Dokter</SelectItem>
                                            <SelectItem value="petugas">Petugas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                    {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update User' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
