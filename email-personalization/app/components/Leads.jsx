"use client";

import Image from "next/image";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Mail, Plus, UserCheck } from "lucide-react";

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
import GeneratedEmailsGallery from "./GeneratedEmailsGallery";

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
            <Button variant="ghost" className="p-0 w-8 h-8">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              {/* <Button variant="outline" onClick={handleGenerateEmail}>
                Generate personalized email
              </Button> */}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={handleViewDetails}>
              <Button variant="outline">View profile details</Button>
            </DropdownMenuItem> */}
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
  const [generatedEmails, setGeneratedEmails] = useState([]);

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
          fetch(`/api/personProfile?linkedin_profile_url=${line}`),
        ),
      );

      const parsedResponses = await Promise.all(
        responses.map(async (res) => {
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

  useEffect(() => {
    setGeneratedEmails(
      JSON.parse(localStorage.getItem("generatedEmails")) || []
    );
  }, []);

  const handleBulkGenerateEmail = () => {
    setIsLoading(true);
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
      <div className="flex flex-col justify-between items-start py-4 space-y-4 pt-md-8 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex gap-2 items-start">
          <div className="flex items-center">
            <Image
              src="/email-logo-dummy.svg"
              alt="Email logo"
              width={24}
              height={24}
              className="text-blue-600"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-blue-600">
              Email Personalization
            </span>
            <span className="text-xs text-gray-500">
              By
              <a
                href="https://nubela.co/proxycurl"
                target="_blank"
                rel="noopener noreferrer"
                className="underline ms-1"
              >
                Proxycurl
              </a>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-4 sm:w-auto">
          <Button variant="outline" onClick={handleAddLeads} className="w-full sm:w-auto">
            <Plus className="mr-2 w-4 h-4" /> Add Leads
          </Button>
          <Button onClick={handleBulkGenerateEmail} className="w-full sm:w-auto">
            <Mail className="mr-2 w-4 h-4" /> Generate all personalized email
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table className="w-full whitespace-nowrap">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="px-2">
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
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2">
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
                    <div className="flex flex-col justify-center items-center py-16 h-full">

                      <p className="text-gray-500">
                        No leads found. Add LinkedIn profile URLs to start
                        personalizing emails.
                      </p>

                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleAddLeads}
                      >
                        <Plus className="w-4 h-4" /> Add Leads
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-end items-center py-4 space-x-2">
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
          <span className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
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

      {/* Add the gallery below the table */}
      <GeneratedEmailsGallery generatedEmails={generatedEmails} />

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
        data={data}
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        isOpen={isEmailDrawerOpen}
        setIsOpen={setIsEmailDrawerOpen}
        setGeneratedEmails={setGeneratedEmails}
      />
    </div>
  );
}

export default Leads;
