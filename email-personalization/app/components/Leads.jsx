"use client";

import React, { useState, useEffect } from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "./Modal";
import ProfileDetailsModal from "./ProfileDetailsModal";
import EmailDrawer from "./EmailDrawer";
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("full_name")}</div>
    ),
  },
  {
    accessorKey: "occupation",
    header: "Occupation",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("occupation")}</div>
    ),
  },
  {
    accessorKey: "country_full_name",
    header: "Country",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("country_full_name")}</div>
    ),
  },
  {
    accessorKey: "public_identifier",
    header: "LinkedIn URL",
    cell: ({ row }) => (
      <div>{`https://www.linkedin.com/in/${row.getValue(
        "public_identifier",
      )}`}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const handleViewDetails = () => {
        table.options.meta.setViewDetails(row.original);
        table.options.meta.setIsDetailsModalOpen(true);
      };

      // const handleGenerateEmail = () => {
      //   table.options.meta.setIsEmailDrawerOpen(true);
      //   table.options.meta.setSelectedLead(row.original);
      // };

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
            <DropdownMenuItem>
              {/* <Button onClick={handleGenerateEmail}>
                Generate personalized email
              </Button> */}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewDetails}>
              <Button>View profile details</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Leads() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [leadsProfile, setLeadsProfile] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkEmail, setIsBulkEmail] = useState(false);

  const handleSaveRecentLeads = (profiles) => {
    const existingLeads =
      JSON.parse(localStorage.getItem("existingLeads")) || [];

    profiles.forEach((profile) => {
      existingLeads.push({ ...profile, isEmailGenerated: false });
    });
    localStorage.setItem("existingLeads", JSON.stringify(existingLeads));
  };

  const handleAddLeads = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const lines = leadsProfile.split("\n");

    try {
      const responses = await Promise.all(
        lines.map((line) =>
          // fetch(`/api/personProfile?linkedin_profile_url=${line}`),
          fetch(`/api/mockPersonProfile?linkedin_profile_url=${line}`),
        ),
      );

      const parsedResponses = await Promise.all(
        responses.map(async (res) => {
          console.log(res, "res");
          if (!res.ok) {
            throw new Error(`Error fetching profile: ${res.statusText}`);
          }
          return res.json();
        }),
      );
      setIsLoading(false);
      setData((prev) => [...prev, ...parsedResponses]);
      handleSaveRecentLeads(parsedResponses);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      // Handle error (e.g., show a notification to the user)
    } finally {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const existingLeads =
      JSON.parse(localStorage.getItem("existingLeads")) || [];
    setData(existingLeads);
  }, []);

  const handleBulkGenerateEmail = () => {
    // setIsLoading(true);
    setIsBulkEmail(true);
    setIsEmailDrawerOpen(true);
  };

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
    meta: {
      setViewDetails,
      setIsDetailsModalOpen,
      setIsEmailDrawerOpen,
      setSelectedLead,
    },
  });

  return (
    <div className="w-full max-w-5xl">
      <div className="flex items-center py-4 justify-end gap-4">
        <Button onClick={handleBulkGenerateEmail}>
          Generate all personalized email
        </Button>
        <Button onClick={handleAddLeads}>Add Leads</Button>
      </div>
      <div className="rounded-md border">
        <Table className="w-full">
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
                            header.getContext(),
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  <span>No Leads yet.</span>
                  <br />
                  <Button className="mt-4" onClick={handleAddLeads}>
                    Add Leads
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
      </div>

      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        leadsProfile={leadsProfile}
        setLeadsProfile={setLeadsProfile}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <ProfileDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        viewDetails={viewDetails}
      />
      <EmailDrawer
        setIsBulkEmail={setIsBulkEmail}
        data={data}
        isBulkEmail={isBulkEmail}
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        isOpen={isEmailDrawerOpen}
        setIsOpen={setIsEmailDrawerOpen}
      />
    </div>
  );
}

export default Leads;
