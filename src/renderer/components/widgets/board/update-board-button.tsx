import { PenBox } from "lucide-react";
import { useState } from "react";
import { EditBoardForm } from "renderer/components/forms/board/edit-board-form";
import { Button } from "renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "renderer/components/ui/dialog";
import { Board } from "shared/types";

type UpdateBoardButtonProps = {
  board: Board;
};

export function UpdateBoardButton({ board }: UpdateBoardButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="rounded justify-start">
          <PenBox /> Edit
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <EditBoardForm setOpen={setOpen} board={board} />
      </DialogContent>
    </Dialog>
  );
}
