'use client';

import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { mockAnnouncements } from "@/lib/mock-data/announcements";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AllAnnouncementsPage() {
    const router = useRouter();

    const sortedAnnouncements = useMemo(() => {
        return [...mockAnnouncements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, []);

    return (
        <div className="space-y-8">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div>
                <h1 className="text-3xl font-headline font-bold">All Announcements</h1>
                <p className="text-muted-foreground">
                    Here is a list of all past and current announcements.
                </p>
            </div>

            {sortedAnnouncements.length > 0 ? (
                <div className="space-y-4">
                    {sortedAnnouncements.map(announcement => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No announcements have been made yet.</p>
                </div>
            )}
        </div>
    );
}
