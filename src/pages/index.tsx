import { UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Freetyme
      </h1>
      <div className="flex flex-col items-center justify-center gap-4"></div>
      {/* <p className="text-2xl text-white">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p> */}
    </div>
  );
}
