'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Issue } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ShieldAlert, Clock, ImageIcon, Edit, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { issueStatuses } from './data';
import Image from 'next/image';

type IssueColumnsProps = {
  openAssignDialog: (issue: Issue) => void;
};

export const issueColumns = ({ openAssignDialog }: IssueColumnsProps): ColumnDef<Issue>[] => {
  const router = useRouter();
  
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Token ID" />,
      cell: ({ row }) => {
        const issue = row.original;
        let path = `/citizen/issues/${issue.id}`;
        // Admins have special views for certain statuses
        if(issue.status === 'Approved') {
          path = `/admin/jobs/${issue.id}`;
        } else if (issue.status === 'Resolved') {
          path = `/admin/issues/${issue.id}`;
        }

        return (
          <div 
            className="font-medium cursor-pointer hover:underline"
            onClick={() => router.push(path)}
          >
            {row.getValue('id')}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    },
    {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => {
            const imageUrl = row.original.imageUrl;
            return imageUrl ? (
              <div className="w-16 h-10 rounded-md overflow-hidden border flex items-center justify-center">
                <Image src={imageUrl} alt={row.original.title} width={64} height={40} className="object-cover" />
              </div>
            ) : (
                <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
            )
        },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = issueStatuses.find(
          (status) => status.value === row.getValue('status')
        )

        if (!status) {
          return null
        }
        
        return (
          <Badge variant={row.original.escalated ? 'destructive' : 'secondary'}>
            {row.original.escalated && <ShieldAlert className="mr-1 h-3 w-3" />}
            {status.label}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
      accessorKey: 'reportedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reported" />,
      cell: ({ row }) => new Date(row.getValue('reportedAt')).toLocaleDateString(),
    },
    {
        accessorKey: 'slaDeadline',
        header: ({ column }) => <DataTableColumnHeader column={column} title="SLA" />,
        cell: ({ row }) => {
            const slaDeadline = row.original.slaDeadline;
            if (!slaDeadline) return <span className="text-muted-foreground">-</span>;
            
            const isBreached = isPast(new Date(slaDeadline));
            
            return (
                 <div className={cn("flex items-center gap-2", isBreached ? "text-destructive" : "text-muted-foreground")}>
                    <Clock className="h-4 w-4" />
                    <span>
                        {isBreached 
                            ? `${formatDistanceToNow(new Date(slaDeadline))} ago` 
                            : formatDistanceToNow(new Date(slaDeadline), { addSuffix: true })
                        }
                    </span>
                 </div>
            )
        }
    },
    {
        id: 'escalated',
        accessorKey: 'escalated',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Escalated" />,
        cell: ({ row }) => (row.original.escalated ? 'Yes' : 'No'),
        filterFn: (row, id, value) => {
             const isEscalated = row.original.escalated ? "yes" : "no";
             return value.includes(isEscalated);
        },
        enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const issue = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
              {issue.status === 'Resolved' && (
                <DropdownMenuItem onClick={() => router.push(`/admin/issues/${issue.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Review Work
                </DropdownMenuItem>
              )}
              {issue.status === 'Submitted' && (
                 <DropdownMenuItem onClick={() => openAssignDialog(issue)}>
                    <Send className="mr-2 h-4 w-4" />
                    Assign for Verification
                </DropdownMenuItem>
              )}
              {issue.status === 'Approved' && (
                 <DropdownMenuItem onClick={() => router.push(`/admin/jobs/${issue.id}`)}>
                    <Send className="mr-2 h-4 w-4" />
                    Assign to Contractor
                </DropdownMenuItem>
              )}
               {issue.status !== 'Submitted' && issue.status !== 'Approved' && issue.status !== 'Resolved' && (
                 <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
               )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
