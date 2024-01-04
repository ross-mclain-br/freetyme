import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/util";
import { Paintbrush } from "lucide-react";

export const ColorPicker = ({
  background,
  setBackground,
  className,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}) => {
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="mt-0 flex flex-wrap gap-1">
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
              onClick={() => setBackground(s)}
            />
          ))}
        </div>
        <div className={"mt-4 flex items-center"}>
          <Input
            type={"color"}
            value={background}
            onChange={(event) => {
              setBackground(event.target.value);
            }}
            className={"m-0 h-8 p-0"}
          />
          <Input
            id="custom"
            value={background}
            className="col-span-2 h-8"
            onChange={(e) => setBackground(e.currentTarget.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
