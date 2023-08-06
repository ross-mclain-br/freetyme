import Calendar from "~/components/calendar";
import { UserPreferences } from "../components/user/userPreferences";

export default function Home() {
  return (
    <div className=" flex flex-col  gap-12 px-4 py-24 ">
      <div className="flex justify-center">
        <input
          type="text"
          name="search"
          id="search"
          className="block rounded-md border-0 bg-transparent py-3 text-center text-2xl font-extrabold tracking-tight text-secondary opacity-20 placeholder:text-secondary focus:ring-0 sm:text-3xl md:text-6xl "
          placeholder="Find Your Freetyme!"
        />
      </div>

      <div className="flex w-full flex-wrap justify-center">
        <div className="md:max-w-9xl flex w-full max-w-7xl flex-col">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
