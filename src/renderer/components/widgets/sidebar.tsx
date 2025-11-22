import { format } from "date-fns";
import {
  BadgeCheckIcon,
  BadgeIcon,
  ChevronRightIcon,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { Clock } from "./clock";
import { useNavigate } from "react-router-dom";
import { TaskItem } from "./task";

const pad = (n: number) => String(n).padStart(2, "0").split("");

export function Sidebar() {
  const navigate = useNavigate();
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
        <div className="border-white/10 bg-white/5 p-6 rounded-xl">
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
          <div className="border-white/10 bg-white/5 p-6 rounded-xl">
            <h2 className="text-base font-semibold mb-3">
              {format(now, "EEEE, MMMM do yyyy")}
            </h2>
            <Clock clock={clock} />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="border-white/10 bg-white/5 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-3">Today's Tasks</h2>
            <ul className="mb-3 gap-y-1 flex flex-col ">
              <li>
                <TaskItem />
              </li>
              <li>
                <TaskItem />
              </li>
              <li>
                <TaskItem />
              </li>
              <li>
                <Button variant={"link"} className="w-full">
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
