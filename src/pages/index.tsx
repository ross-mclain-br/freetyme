import HomeTabs from "~/components/homeTabs";

export default function Home() {
  return (
    <div className=" flex flex-col  gap-12 px-4 py-24 ">
      <div className="flex w-full flex-wrap justify-center">
        <div className="md:max-w-9xl flex w-full max-w-7xl flex-col items-center">
          <HomeTabs />
        </div>
      </div>
    </div>
  );
}
