import { format } from "date-fns";
import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { Clock } from "./clock";
import { TaskItem } from "./task/task";

const pad = (n: number) => String(n).padStart(2, "0").split("");

export function Sidebar() {
  const [now, setNow] = useState(new Date());

  const clock = {
    hours: pad(now.getHours()),
    minutes: pad(now.getMinutes()),
    seconds: pad(now.getSeconds()),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ShadcnSidebar>
      <SidebarHeader className="pt-6">
        <div className="bg-secondary p-6 rounded-xl">
          <div className="flex items-end gap-x-2 mb-3">
            <h2 className="text-3xl font-semibold text-white">Kelarin</h2>
            <h3 className="text-sm text-white/60">(v1.0.0)</h3>
          </div>
          <p className="text-sm text-white/60">
            An open-source productivity engine that keeps you moving.
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <div className="bg-secondary p-6 rounded-xl">
            <h2 className="text-base font-semibold mb-3">
              {format(now, "EEEE, MMMM do yyyy")}
            </h2>
            <Clock clock={clock} />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="bg-secondary p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Today's Tasks</h2>
              <span className="text-xs px-3 font-bold rounded-lg py-1.5 bg-white/15">
                7 tasks
              </span>
            </div>
            <ul className="mb-3 gap-y-1 flex flex-col ">
              <li>
                <TaskItem detailed />
              </li>
              <li>
                <TaskItem detailed />
              </li>
              <li>
                <TaskItem detailed />
              </li>
              <li>
                <Button className="w-full" variant={"link"}>
                  +4 More Tasks
                </Button>
              </li>
            </ul>
            <Button className="w-full">
              Lock in now <Rocket />
            </Button>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
}
