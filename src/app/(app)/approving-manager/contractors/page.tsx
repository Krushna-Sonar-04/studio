import { mockUsers } from "@/lib/mock-data";
import { ContractorTable } from "@/components/approving-manager/ContractorTable";

export default function ContractorManagementPage() {
    // In a real app, you'd fetch this data. Here we filter from mock data.
    const contractors = mockUsers.filter(user => user.role === 'Contractor');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Contractor Management</h1>
                <p className="text-muted-foreground">
                    View, add, edit, and manage all contractors in the system.
                </p>
            </div>
            <ContractorTable data={contractors} />
        </div>
    );
}
