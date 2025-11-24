"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { EditBoardForm } from "renderer/components/forms/board/edit-board-form";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "renderer/components/ui/dialog";

export function NewBoardCard() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="block w-full hover:cursor-pointer group relative bg-secondary/40 border-dashed hover:border-white/50 hover:border-solid transition-all duration-300 border-2 border-white/15 rounded-lg h-full min-h-[306px]">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <div className="flex items-center flex-col justify-center text-white/50 group-hover:text-white transition-all duration-300">
              <Plus className="mb-9" size={32} />
              <h2 className="font-bold uppercase">New Board</h2>
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <EditBoardForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
