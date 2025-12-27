import TicketView from "@/components/ticket-view";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
            <TicketView id={id} />
        </main>
    );
}
