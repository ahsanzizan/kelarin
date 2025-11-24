import { Search } from "lucide-react";
import { useMemo } from "react";
import { SidebarLayout } from "renderer/components/layouts/sidebar.layout";
import { Button } from "renderer/components/ui/button";
import { BoardCard } from "renderer/components/widgets/board/board-card";
import { NewBoardCard } from "renderer/components/widgets/board/new-board-card";
import { useLogout } from "renderer/data/auth/use-logout";
import { useSession } from "renderer/data/auth/use-session";
import { useBoards } from "renderer/data/board/use-boards";

export function MainScreen() {
  const { data: session, isLoading: isSessionLoading } = useSession();
  const { mutate: logout } = useLogout();
  const { data: boards, isLoading } = useBoards();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 5) {
      return {
        title: "Early Start",
        description: "A calm start leads to a powerful day ahead.",
      };
    }
    if (hour < 11) {
      return {
        title: "Morning",
        description: "Take charge and make today amazing.",
      };
    }
    if (hour < 14) {
      return {
        title: "Afternoon",
        description: "Keep the momentum — you're doing great.",
      };
    }
    if (hour < 18) {
      return {
        title: "Evening",
        description: "Reflect, refocus, and finish strong.",
      };
    }
    return {
      title: "Night",
      description: "Late night worker? Remember to rest and recharge.",
    };
  }, []);

  return (
    <SidebarLayout className="flex justify-end">
      <section className="w-11/12">
        <div className="w-full flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {greeting.title}, {session?.user?.username}
            </h1>
            <p className="text-base text-white/50">{greeting.description}</p>
          </div>
          <div className="flex items-center gap-x-3 bg-secondary rounded-lg p-2">
            <Button size={"sm"}>Star & Contribute!</Button>
            <Button size={"icon-sm"} variant={"ghost"}>
              <Search />
            </Button>
            <Button size={"icon-sm"} variant={"ghost"}></Button>
            <Button size={"icon-sm"} variant={"ghost"}></Button>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white">Your Boards</h2>
          <ul className="grid grid-cols-4 gap-6 mt-5">
            {boards?.map((board) => (
              <li key={board.id}>
                <BoardCard board={board} />
              </li>
            ))}
            <li>
              <NewBoardCard />
            </li>
          </ul>
        </div>
      </section>
    </SidebarLayout>
  );
}
