"use client";

import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Button } from "@/components/ui/button";
import { ScanLine, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for MVP
        if (password === "admin123") {
            setAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Admin Login</CardTitle>
                        <CardDescription>Enter password to access dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button type="submit" className="w-full">Login</Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Default password: admin123
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-4 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor ticket sales, scans, and analytics
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleRefresh}
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                    <Link href="/admin/scan">
                        <Button size="lg" className="gap-2">
                            <ScanLine className="w-5 h-5" />
                            Launch Scanner
                        </Button>
                    </Link>
                </div>
            </div>

            <AnalyticsDashboard key={refreshKey} />
        </main>
    );
}
