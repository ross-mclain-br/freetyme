import { PlusIcon } from "@heroicons/react/20/solid";
import { Fragment, SetStateAction, Dispatch } from "react";
import { Dialog, Transition } from "@headlessui/react";

const people = [
  {
    name: "Lindsay Walton",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Courtney Henry",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Tom Cook",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Whitney Francis",
    role: "Copywriter",
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Leonard Krasner",
    role: "Senior Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    role: "Principal Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export const ManageGroupsModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-tertiary/50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-6">
                <div>
                  <div className="mx-auto max-w-md sm:max-w-3xl">
                    <div>
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-secondary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="{2}"
                            d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <h2 className="mt-2 text-base font-semibold leading-6 text-secondary">
                          Add group members
                        </h2>
                        <p className="mt-1 text-sm text-secondary/70">
                          You haven’t added any team members to your project
                          yet.
                        </p>
                      </div>
                      <form className="mt-6 sm:flex sm:items-center" action="#">
                        <label htmlFor="emails" className="sr-only">
                          {" "}
                          Email addresses{" "}
                        </label>
                        <div className="grid grid-cols-1 sm:flex-auto">
                          <input
                            type="text"
                            name="emails"
                            id="emails"
                            className="peer relative col-start-1 row-start-1 rounded-md border-0 bg-transparent py-1.5 text-secondary placeholder:text-secondary focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter an email"
                          />
                          <div
                            className="col-start-1 col-end-3 row-start-1 rounded-md shadow-sm ring-1 ring-inset ring-secondary peer-focus:ring-2 peer-focus:ring-secondary"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                          <button
                            type="submit"
                            className="block w-full rounded-md border border-secondary bg-secondary px-3 py-2 text-center text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                          >
                            Send invite
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="mt-10">
                      <h3 className="text-sm font-medium text-secondary">
                        Recommended group members
                      </h3>
                      <ul
                        role="list"
                        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
                      >
                        {people.map((person, personIdx) => (
                          <li key="{personIdx}">
                            <button
                              type="button"
                              className="group flex w-full items-center justify-between space-x-3 rounded-md border border-secondary p-2 text-left shadow-sm transition-all duration-300 hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-tertiary"
                            >
                              <span className="flex min-w-0 flex-1 items-center space-x-3">
                                <span className="block flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-md"
                                    src={person.imageUrl}
                                    alt=""
                                  />
                                </span>
                                <span className="block min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium text-secondary group-hover:text-primary">
                                    {person.name}
                                  </span>
                                  <span className="block truncate text-sm font-medium text-secondary/50 group-hover:text-primary/50">
                                    {person.role}
                                  </span>
                                </span>
                              </span>
                              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
                                <PlusIcon
                                  className="h-5 w-5 text-secondary group-hover:text-primary"
                                  aria-hidden="true"
                                />
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-center sm:mt-6">
                  <div className="space-x-4">
                    <button
                      type="button"
                      className="inline-flex w-24 justify-center rounded-md border border-secondary px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      onClick={() => setOpen(false)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-24 justify-center rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-tertiary shadow-sm transition-all duration-300 hover:bg-transparent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      onClick={() => setOpen(false)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default ManageGroupsModal;
