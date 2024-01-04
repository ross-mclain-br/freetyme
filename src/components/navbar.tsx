import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";

export const Navbar = () => {
  const pageName = useRouter().pathname?.toLowerCase();
  const { isSignedIn } = useUser();
  return (
    <Disclosure as="nav" className={`bg-tertiary shadow `}>
      {({ open }) => (
        <>
          <div
            className={`mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-7xl ${
              !isSignedIn ? "blur-sm" : ""
            } transition-all duration-150`}
          >
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:bg-sexinary hover:text-quaternary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tertiary">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center"></div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link
                    href="/"
                    className={`inline-flex items-center  px-1 pt-1 text-sm font-medium  ${
                      pageName === "/"
                        ? "border-b-2 border-secondary text-secondary"
                        : "text-secondary/70 hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    Calendar
                  </Link>
                  <Link
                    href="/groups"
                    className={`inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium ${
                      pageName === "/groups"
                        ? "border-b-2 border-secondary text-secondary"
                        : "text-secondary/70 hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    Groups
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                {/* <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md border border-secondary px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-150 hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    <ClockIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Lets Schedule!
                  </button>
                </div> */}
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-12 h-12",
                        userButtonPopoverCard: "bg-secondary/50 shadow-lg",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700 sm:pl-5 sm:pr-6"
              >
                Calendar
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/groups"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Groups
              </Disclosure.Button>
            </div>
            <div className="px-5">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-12 h-12",
                    userButtonPopoverCard: "bg-secondary/50 shadow-lg",
                  },
                }}
              />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
