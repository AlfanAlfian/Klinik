import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Bar, CartesianGrid, Cell, LabelList, Line, LineChart, BarChart as ReBarChart, XAxis } from 'recharts';

interface Statistics {
    popularTindakan: {
        name: string;
        total: number;
    };
    dailyVisits: {
        date: string;
        total_visits: number;
    }[];
    monthlyRevenue: {
        month: number;
        year: number;
        total_revenue: number;
    }[];
    popularProducts: {
        product_name: string;
        total_prescribed: number;
    }[];
}

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function Dashboard({ statistics }: { statistics: Statistics }) {
    // Format revenue data for chart
    const revenueData = statistics.monthlyRevenue.map((item) => ({
        name: format(new Date(item.year, item.month - 1), 'MMM', { locale: id }),
        total: item.total_revenue,
    }));

    // Format visits data for chart
    const visitsData = statistics.dailyVisits.map((item) => ({
        name: format(new Date(item.date), 'd MMM', { locale: id }),
        total: item.total_visits,
    }));

    // Format products data for chart (for BarChart lama)
    const productsData = statistics.popularProducts.map((item) => ({
        name: item.product_name,
        total: item.total_prescribed,
    }));

    // Format products data for ChartContainer (shadcn terbaru)
    const chartData = statistics.popularProducts.map((item) => ({
        name: item.product_name,
        desktop: item.total_prescribed,
    }));

    // Data pasien mendaftar per hari untuk line chart
    const dailyPatientData = statistics.dailyVisits.map((item) => ({
        date: item.date,
        pasien: item.total_visits,
    }));

    const chartConfig = {
        desktop: {
            label: 'Jumlah Resep',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    // Array warna untuk setiap bar
    const barColors = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'];

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = statistics.dailyVisits.find((v) => v.date === today)?.total_visits ?? 0;
    const monthVisits = statistics.dailyVisits.reduce((sum, visit) => sum + visit.total_visits, 0);
    const currentMonthRevenue = statistics.monthlyRevenue[statistics.monthlyRevenue.length - 1]?.total_revenue ?? 0;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kunjungan Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{todayVisits} Pasien</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Kunjungan Bulan Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{monthVisits} Pasien</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pendapatan Bulan Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatRupiah(currentMonthRevenue)}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tindakan Terbanyak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{statistics.popularTindakan.name}</p>
                            <p className="text-muted-foreground text-sm">{statistics.popularTindakan.total} kali bulan ini</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Chart Obat Terlaris */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Obat Terlaris</CardTitle>
                            <CardDescription>Bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <ReBarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 10)}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="desktop" radius={8}>
                                        {chartData.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={barColors[idx % barColors.length]} />
                                        ))}
                                    </Bar>
                                </ReBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Chart Pasien Mendaftar per Hari */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pasien Mendaftar per Hari</CardTitle>
                            <CardDescription>Bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    pasien: {
                                        label: 'Pasien',
                                        color: '#0ea5e9',
                                    },
                                }}
                            >
                                <LineChart data={dailyPatientData} margin={{ top: 20, left: 12, right: 12 }} width={400} height={220}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(5)} // tampilkan MM-DD
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line
                                        dataKey="pasien"
                                        type="natural"
                                        stroke="#0ea5e9"
                                        strokeWidth={2}
                                        dot={{ fill: '#0ea5e9' }}
                                        activeDot={{ r: 6 }}
                                    >
                                        <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                                    </Line>
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
