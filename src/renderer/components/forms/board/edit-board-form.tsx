import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "renderer/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "renderer/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "renderer/components/ui/form";
import { Input } from "renderer/components/ui/input";
import { useUpsertBoard } from "renderer/data/board/use-upsert-board";
import { Board } from "shared/types";
import { boardSchema, BoardSchema } from "shared/validations/board";
import { toast } from "sonner";

type EditBoardFormProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  board?: Board;
};

export function EditBoardForm({ board, setOpen }: EditBoardFormProps) {
  const form = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      id: board?.id,
      title: board?.title,
      description: board?.description,
      color: board?.color ?? "#fff",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const { mutate: upsert, isPending } = useUpsertBoard();

  const uiText = useMemo(
    () =>
      board === undefined
        ? {
            title: "Create a new board",
            subtitle: "Give your board a name. You can update this later.",
            button: "Create",
          }
        : {
            title: `Update board ${board.title}`,
            subtitle: "Edit your board's details.",
            button: "Update",
          },
    [board]
  );

  const onSubmit = async (values: BoardSchema) => {
    try {
      upsert(values, {
        onSuccess: () => {
          form.reset();
          toast.success("Your board has been saved", {
            action: {
              label: "Open",
              onClick: () => {},
            },
          });
          setOpen(false);
        },
        onError: (reqErr) => {
          toast("An error occurred while saving board", {
            description: reqErr.message,
          });
        },
      });

      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{uiText.title}</DialogTitle>
          <DialogDescription>{uiText.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-200">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="title"
                    placeholder="Marketing Sprint"
                    className="border-white/10 bg-black/50 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-200">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="description"
                    placeholder="Optional description..."
                    className="border-white/10 bg-black/50 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-200">Color</FormLabel>
                <FormControl>
                  <Input {...field} type="color" className="h-10 p-1" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : uiText.button}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
