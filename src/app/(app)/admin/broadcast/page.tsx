import { BroadcastForm } from "@/components/admin/BroadcastForm";

export default function BroadcastPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Send a Broadcast Announcement</h1>
                <p className="text-muted-foreground">
                    Compose and send an announcement to all citizens. It will appear on their dashboards.
                </p>
            </div>
            <BroadcastForm />
        </div>
    );
}
