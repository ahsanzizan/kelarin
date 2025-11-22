import { ReactNode } from "react";

export function Clock({
  clock,
}: {
  clock: { hours: string[]; minutes: string[]; seconds: string[] };
}) {
  return (
    <div className="flex items-center justify-between">
      <DigitsContainer>
        <Digit>{clock.hours[0]}</Digit>
        <Digit>{clock.hours[1]}</Digit>
      </DigitsContainer>
      <Colon />
      <DigitsContainer>
        <Digit>{clock.minutes[0]}</Digit>
        <Digit>{clock.minutes[1]}</Digit>
      </DigitsContainer>
      <Colon />
      <DigitsContainer>
        <Digit>{clock.seconds[0]}</Digit>
        <Digit>{clock.seconds[1]}</Digit>
      </DigitsContainer>
    </div>
  );
}

function Colon() {
  return <span className="font-semibold">:</span>;
}

function DigitsContainer({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-x-1">{children}</div>;
}

function Digit({ children }: { children?: ReactNode }) {
  return (
    <span className="text-3xl p-2 bg-white/10 rounded font-bold">
      {children}
    </span>
  );
}
