import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ViewParcels() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); // default sort
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetAllParcelsQuery({
    searchTerm: search,
    sort: sortBy,
    limit,
    page,
  });
  console.log(data);



  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isLoading) toastIdRef.current = toast.loading("Loading parcels...");
    else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error("Error loading parcel data");
  }, [error]);
  const totalPages = data?.meta?.totalPage || 1;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Picked Parcels waiting for transit</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Search by keyword..."
          value={search}
          onChange={(e) => {
            setPage(1); // reset to first page
            setSearch(e.target.value);
          }}
          className="w-64"
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created At</SelectItem>
            <SelectItem value="trackingId">Tracking ID</SelectItem>
            <SelectItem value="receiverName">Receiver Name</SelectItem>
          </SelectContent>
        </Select>

        <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Tracking ID</th>
            <th className="border border-gray-300 p-2 text-left">Receiver</th>
            <th className="border border-gray-300 p-2 text-left">Phone</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Destination</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((parcel) => (
            <tr key={parcel._id}>
              <td className="border border-gray-300 p-2">{parcel.trackingId}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverName}</td>
              <td className="border border-gray-300 p-2">{parcel.receiverPhone}</td>
              <td className="border border-gray-300 p-2">{parcel.currentStatus}</td>
              <td className="border border-gray-300 p-2">
                {parcel.destinationAddress.address}, {parcel.destinationAddress.district}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.data?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No picked parcels found
        </div>
      )}
      total pages:{totalPages}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((prev) => prev - 1)}
                className={
                  page === 1 ? "pointer-events-none opacity-50"
                    :
                    "cursor-pointer"

                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem
                key={page}
                onClick={()=>setPage(page)}
                >
                  <PaginationLink isActive={page===page}>{page}</PaginationLink>
                </PaginationItem>

              )
            )}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
              onClick={()=>setPage((prev)=>prev+1)}
              className={
                page===totalPages?
                "pointer-events-none opacity-50"
                :"cursor-pointer"
              }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      )}

    </div>
  );
}
