import TicketView from "@/components/ticket-view";

export default function TicketPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-4">
            <TicketView id={params.id} />
        </main>
    );
}
