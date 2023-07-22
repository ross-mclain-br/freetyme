import { UserButton } from "@clerk/nextjs";
import Calendar from "~/components/calendar";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className=" flex flex-col  gap-12 px-4 py-24 ">
      <div className="flex justify-center">
        <input
          type="text"
          name="search"
          id="search"
          className="block rounded-md border-0 bg-transparent py-3 text-center text-2xl font-extrabold tracking-tight text-secondary  opacity-20 placeholder:text-secondary focus:ring-0 sm:text-3xl md:text-6xl "
          placeholder="Find Your Freetyme!"
        />
      </div>

      <div className="mx-auto flex  w-full max-w-7xl flex-col items-center">
        <Calendar />
      </div>
    </div>
  );
}
