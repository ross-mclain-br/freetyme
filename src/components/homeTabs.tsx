import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calendar from "~/components/calendar";
import FreeTyme from "~/components/freetyme";

export const HomeTabs = () => {
  return (
    <Tabs defaultValue="freetyme" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="freetyme">FreeTyme</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>
      <TabsContent value="freetyme">
        <div className={"px-3"}>
          <FreeTyme />
        </div>
      </TabsContent>
      <TabsContent value="schedule">
        <div className={"px-3"}>
          <Calendar />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HomeTabs;
