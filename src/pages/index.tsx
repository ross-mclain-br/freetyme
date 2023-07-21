import { UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className=" flex flex-col items-center gap-12 px-4 py-24 ">
      
      <input
        type="text"
        name="search"
        id="search"
        className="block  rounded-md border-0 bg-transparent py-3 font-extrabold tracking-tight text-center opacity-20 text-secondary  placeholder:text-secondary focus:ring-0 sm:text-6xl "
        placeholder="Find Your Freetyme!"
      />
      <div className="flex flex-col items-center justify-center gap-4"></div>
    </div>
  );
}
