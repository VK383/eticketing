"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, Legend } from "recharts";
import { Loader2, Users, CheckCircle, XCircle, Clock, Ticket as TicketIcon, IndianRupee, TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/ticket-pricing";

interface ChartData {
    name: string;
    bookings: number;
}

interface Ticket {
    status: string;
    created_at: string;
    event_date: string;
    ticket_type?: string;
    amount?: number;
    payment_status?: string;
}

interface Stats {
    total: number;
    used: number;
    booked: number;
    pending: number;
    expired: number;
    cancelled: number;
    totalRevenue: number;
    successfulPayments: number;
    failedPayments: number;
    regularTickets: number;
    vipTickets: number;
    premiumTickets: number;
}

const COLORS = ['#adfa1d', '#7c3aed', '#f59e0b', '#ef4444'];

export function AnalyticsDashboard() {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        used: 0,
        booked: 0,
        pending: 0,
        expired: 0,
        cancelled: 0,
        totalRevenue: 0,
        successfulPayments: 0,
        failedPayments: 0,
        regularTickets: 0,
        vipTickets: 0,
        premiumTickets: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: tickets, error } = await supabase
                .from("tickets")
                .select("status, created_at, event_date, ticket_type, amount, payment_status");

            if (error) throw error;

            if (tickets) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const total = tickets.length;
                const used = tickets.filter((t: Ticket) => t.status === "used").length;
                const booked = tickets.filter((t: Ticket) => t.status === "booked").length;
                const pending = tickets.filter((t: Ticket) => t.status === "pending").length;
                const cancelled = tickets.filter((t: Ticket) => t.status === "cancelled").length;
                
                // Calculate expired tickets (event date passed and status is not 'used')
                const expired = tickets.filter((t: Ticket) => {
                    const eventDate = new Date(t.event_date);
                    return eventDate < today && t.status !== "used";
                }).length;

                // Revenue calculations
                const successfulPayments = tickets.filter((t: Ticket) => 
                    t.payment_status === "success"
                ).length;
                
                const failedPayments = tickets.filter((t: Ticket) => 
                    t.payment_status === "failed"
                ).length;

                const totalRevenue = tickets
                    .filter((t: Ticket) => t.payment_status === "success")
                    .reduce((sum: number, t: Ticket) => sum + (t.amount || 0), 0);

                // Ticket type breakdown
                const regularTickets = tickets.filter((t: Ticket) => 
                    t.ticket_type === "regular" || !t.ticket_type
                ).length;
                const vipTickets = tickets.filter((t: Ticket) => 
                    t.ticket_type === "vip"
                ).length;
                const premiumTickets = tickets.filter((t: Ticket) => 
                    t.ticket_type === "premium"
                ).length;

                setStats({ 
                    total, 
                    used, 
                    booked, 
                    pending,
                    expired,
                    cancelled,
                    totalRevenue,
                    successfulPayments,
                    failedPayments,
                    regularTickets,
                    vipTickets,
                    premiumTickets
                });

                // Chart data for bookings over time
                const grouped = tickets.reduce((acc: Record<string, number>, t: Ticket) => {
                    const date = new Date(t.created_at).toLocaleDateString();
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.keys(grouped)
                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                    .slice(-7) // Last 7 days
                    .map(date => ({
                        name: date,
                        bookings: grouped[date],
                    }));

                setData(chartData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    const ticketTypeData = [
        { name: 'Regular', value: stats.regularTickets, color: COLORS[0] },
        { name: 'VIP', value: stats.vipTickets, color: COLORS[1] },
        { name: 'Premium', value: stats.premiumTickets, color: COLORS[2] },
    ].filter(item => item.value > 0);

    const statusData = [
        { name: 'Booked', value: stats.booked, color: '#10b981' },
        { name: 'Used', value: stats.used, color: '#6366f1' },
        { name: 'Expired', value: stats.expired, color: '#f59e0b' },
        { name: 'Pending', value: stats.pending, color: '#94a3b8' },
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <TicketIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time generated</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scanned</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.used}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.total > 0 ? ((stats.used / stats.total) * 100).toFixed(1) : 0}% attendance
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.expired}</div>
                        <p className="text-xs text-muted-foreground mt-1">Past event date</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.booked}</div>
                        <p className="text-xs text-muted-foreground mt-1">Ready to scan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatINR(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.successfulPayments} successful payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.successfulPayments + stats.failedPayments > 0
                                ? ((stats.successfulPayments / (stats.successfulPayments + stats.failedPayments)) * 100).toFixed(1)
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.failedPayments} failed attempts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <XCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">\n                {/* Booking Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Trends (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `${value}`} 
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: 'none', 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                    }}
                                />
                                <Bar dataKey="bookings" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Ticket Type Distribution */}
                {ticketTypeData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={ticketTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {ticketTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Status Distribution */}
                {statusData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Status Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
