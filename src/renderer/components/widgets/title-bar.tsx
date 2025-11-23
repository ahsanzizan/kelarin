import { Minus, Square, X } from "lucide-react";

const { App } = window;

export function TitleBar() {
  const handleMin = () => App.screen.minimize();
  const handleMax = () => App.screen.maximize();
  const handleClose = () => App.screen.close();

  return (
    <div
      className="
        fixed top-0 left-0 right-0 z-9999
    h-8 bg-background
    flex justify-end items-center select-none
      "
    >
      <div className="absolute left-0 right-[135px] top-0 bottom-0 -webkit-app-region-drag" />

      <div className="flex">
        <button
          onClick={handleMin}
          className="w-[45px] transition-all duration-300 h-8 flex justify-center items-center hover:bg-[#2d2d2d] -webkit-app-region-no-drag"
        >
          <Minus size={12} />
        </button>

        <button
          onClick={handleMax}
          className="w-[45px] transition-all duration-300 h-8 flex justify-center items-center hover:bg-[#2d2d2d] -webkit-app-region-no-drag"
        >
          <Square size={12} />
        </button>

        <button
          onClick={handleClose}
          className="w-[45px] transition-all duration-300 h-8 flex justify-center items-center hover:bg-[#e81123] -webkit-app-region-no-drag group"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
