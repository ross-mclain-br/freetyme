import { PlusIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import ManageGroupsModal from "~/components/groups/manage";

export const GroupsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="container mx-auto grid grid-cols-12 sm:p-32 ">
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="group relative col-span-4 block rounded-lg border-2 border-dashed border-secondary p-12 text-center text-secondary transition-all duration-300 hover:border-solid hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          <svg
            className="mx-auto h-12 w-12 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>

          <span className="mt-2 block text-sm font-semibold ">
            Create a new group
          </span>
        </button>
      </div>
      <ManageGroupsModal open={open} setOpen={setOpen} />
    </>
  );
};
export default GroupsPage;
