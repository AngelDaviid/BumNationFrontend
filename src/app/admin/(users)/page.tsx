"use client";

import { columns } from "./columns";
import { useUsers } from "@/hooks/users/use-all-users";
import { DataTable } from "@/components/ui/data-table";
import Navbar from "@/components/navbar/nav-bar";

export default function AllUsersPage() {
  const {
    users,
    isLoading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    search,
    setSearch,
  } = useUsers({ limit: 10 });

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar></Navbar>
      <div className="space-y-4 m-4">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por identificación..."
          page={page}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      </div>
    </>
  );
}