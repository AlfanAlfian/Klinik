import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
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
    const exportRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = async () => {
        const style = document.createElement('style');
        style.innerHTML = `
      * {
        background: #fff !important;
        color: #000 !important;
        border-color: #e5e7eb !important;
        box-shadow: none !important;
      }
      .bg-blue-600, .hover\\:bg-blue-700:hover { background: #2563eb !important; }
      .text-white { color: #fff !important; }
      .text-muted-foreground { color: #6b7280 !important; }
      .fill-foreground { fill: #000 !important; }
    `;
        document.head.appendChild(style);

        if (!exportRef.current) return;
        try {
            const canvas = await html2canvas(exportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('dashboard-summary.pdf');
        } catch (err) {
            alert('Export gagal. Pastikan tidak ada warna CSS oklch() pada elemen yang diexport.');
            console.error(err);
        }
        document.head.removeChild(style);
    };

    const revenueData = statistics.monthlyRevenue.map((item) => ({
        name: format(new Date(item.year, item.month - 1), 'MMM', { locale: id }),
        total: item.total_revenue,
    }));

    const visitsData = statistics.dailyVisits.map((item) => ({
        name: format(new Date(item.date), 'd MMM', { locale: id }),
        total: item.total_visits,
    }));

    const productsData = statistics.popularProducts.map((item) => ({
        name: item.product_name,
        total: item.total_prescribed,
    }));

    const chartData = statistics.popularProducts.map((item) => ({
        name: item.product_name,
        desktop: item.total_prescribed,
    }));

    const dailyPatientData = statistics.dailyVisits.map((item) => ({
        date: item.date,
        pasien: item.total_visits,
    }));

    const chartConfig = {
        desktop: {
            label: 'Jumlah Resep',
            color: '#0ea5e9',
        },
    } satisfies ChartConfig;

    const barColors = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'];

    const today = new Date().toISOString().split('T')[0];
    const todayVisits = statistics.dailyVisits.find((v) => v.date === today)?.total_visits ?? 0;
    const monthVisits = statistics.dailyVisits.reduce((sum, visit) => sum + visit.total_visits, 0);
    const currentMonthRevenue = statistics.monthlyRevenue[statistics.monthlyRevenue.length - 1]?.total_revenue ?? 0;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="mt-2 mr-4 flex justify-end">
                <button onClick={handleExportPDF} className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                    Export PDF
                </button>
            </div>

            <div ref={exportRef} style={{ background: '#fff' }}>
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
                                            tickFormatter={(value) => value.slice(5)}
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
            </div>
        </AppLayout>
    );
}
