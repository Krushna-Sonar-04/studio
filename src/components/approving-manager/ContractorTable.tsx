'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, PlusCircle, ChevronDown, Edit, Trash2, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { AddContractorSheet } from './AddContractorSheet';
import { useToast } from '@/hooks/use-toast';
import { addMockUser, setMockUsers, mockUsers } from '@/lib/mock-data';


export function ContractorTable({ data: initialData }: { data: User[] }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [data, setData] = React.useState<User[]>(initialData);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [isSheetOpen, setSheetOpen] = React.useState(false);
    const [isAlertOpen, setAlertOpen] = React.useState(false);
    const [selectedContractor, setSelectedContractor] = React.useState<User | null>(null);

    const isApprovingManager = user?.role === 'Approving Manager';

    const handleSaveContractor = (contractorData: Omit<User, 'id' | 'role' | 'avatarUrl'>) => {
        if (selectedContractor) { // Edit mode
            const updatedUsers = mockUsers.map(u => 
                u.id === selectedContractor.id ? { ...u, ...contractorData } : u
            );
            setMockUsers(updatedUsers);
            setData(updatedUsers.filter(u => u.role === 'Contractor'));
        } else { // Add mode
            const newUser: User = {
                id: `user-${Date.now()}`,
                role: 'Contractor',
                avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
                ...contractorData,
            };
            addMockUser(newUser);
            setData([...data, newUser]);
        }
    };
    
    const handleDelete = () => {
        if (!selectedContractor) return;
        const updatedUsers = mockUsers.filter(u => u.id !== selectedContractor.id);
        setMockUsers(updatedUsers);
        setData(updatedUsers.filter(u => u.role === 'Contractor'));
        toast({ title: "Contractor Deleted", description: `${selectedContractor.name} has been removed.` });
        setAlertOpen(false);
        setSelectedContractor(null);
    };

    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'department',
        header: 'Department',
      },
      {
        accessorKey: 'zone',
        header: 'Zone',
      },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.getValue('active');
          return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const contractor = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert(`Viewing stats for ${contractor.name}`)}>
                   <BarChart2 className="mr-2 h-4 w-4" /> View Stats
                </DropdownMenuItem>
                {isApprovingManager && <>
                    <DropdownMenuItem onClick={() => { setSelectedContractor(contractor); setSheetOpen(true); }}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedContractor(contractor); setAlertOpen(true);}}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </>}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search contractors by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {isApprovingManager && (
            <Button onClick={() => { setSelectedContractor(null); setSheetOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Contractor
            </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            Next
        </Button>
      </div>

       <AddContractorSheet 
            isOpen={isSheetOpen} 
            onOpenChange={setSheetOpen} 
            contractor={selectedContractor}
            onSave={handleSaveContractor}
        />

        <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the contractor
                        <span className="font-bold"> {selectedContractor?.name}</span> and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedContractor(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
