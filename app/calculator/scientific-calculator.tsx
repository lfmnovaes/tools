import { Button } from "@/components/ui/button";
import {
  AsteriskIcon,
  ChevronUpIcon,
  DivideIcon,
  MinusIcon,
  PlusIcon,
  PercentIcon,
  RadicalIcon,
  EqualIcon,
  PiIcon,
} from "lucide-react";
import type { ReactNode } from "react";

interface ScientificCalculatorProps {
  onButtonClick: (value: string, shouldMoveCursor?: boolean) => void;
}

type ButtonConfig = {
  value: string;
  display: string | ReactNode;
  className?: string;
  disabled?: boolean;
  insertCursor?: boolean;
};

const createButtons = (): ButtonConfig[][] => [
  // First row - Numbers and basic operators
  [
    { value: "7", display: "7" },
    { value: "8", display: "8" },
    { value: "9", display: "9" },
    { value: "/", display: <DivideIcon className="h-4 w-4" /> },
    { value: "(", display: "(" },
    { value: ")", display: ")" },
    { value: "sqrt()", display: <RadicalIcon className="h-4 w-4" />, insertCursor: true },
    { value: "C", display: "C" },
  ],
  // Second row
  [
    { value: "4", display: "4" },
    { value: "5", display: "5" },
    { value: "6", display: "6" },
    { value: "*", display: <AsteriskIcon className="h-4 w-4" /> },
    { value: "pi", display: <PiIcon className="h-4 w-4" /> },
    { value: "sin()", display: "sin", insertCursor: true },
    { value: "cos()", display: "cos", insertCursor: true },
    { value: "tan()", display: "tan", insertCursor: true },
  ],
  // Third row
  [
    { value: "1", display: "1" },
    { value: "2", display: "2" },
    { value: "3", display: "3" },
    { value: "-", display: <MinusIcon className="h-4 w-4" /> },
    { value: "%", display: <PercentIcon className="h-4 w-4" /> },
    { value: "^", display: <ChevronUpIcon className="h-4 w-4" /> },
    { value: "log()", display: "log", insertCursor: true },
    { value: "ln()", display: "ln", insertCursor: true },
  ],
  // Fourth row
  [
    { value: "0", display: "0" },
    { value: ".", display: "." },
    { value: "=", display: <EqualIcon className="h-4 w-4" /> },
    { value: "+", display: <PlusIcon className="h-4 w-4" /> },
    { value: "exp()", display: "exp", insertCursor: true },
    { value: "abs()", display: "abs", insertCursor: true },
    { value: "round()", display: "round", insertCursor: true },
    { value: "ans", display: "ans", disabled: true },
  ],
];

export function ScientificCalculator({ onButtonClick }: ScientificCalculatorProps) {
  const buttons = createButtons();

  const handleButtonClick = (button: ButtonConfig) => {
    if (button.disabled) return;

    if (button.value === "C") {
      onButtonClick("", true); // Clear the input
      return;
    }

    if (button.insertCursor) {
      // For functions that need cursor placement between parentheses,
      // send the full value and a flag to indicate cursor movement
      const value = button.value;
      const openParenIndex = value.indexOf("(");
      if (openParenIndex !== -1) {
        // Send the opening part first (e.g., "sin(")
        onButtonClick(value.slice(0, openParenIndex + 1), false);
        // Then send the closing part (")") with cursor positioning
        onButtonClick(value.slice(openParenIndex + 1), true);
      } else {
        onButtonClick(value, true);
      }
    } else {
      // For regular buttons (numbers, operators), just send the value
      onButtonClick(button.value, false);
    }
  };

  return (
    <div className="w-full bg-neutral-900 border-t border-neutral-700 p-4">
      <div className="grid grid-cols-8 gap-2 max-w-4xl mx-auto">
        {buttons.map((row, rowIndex) =>
          row.map((button, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="secondary"
              disabled={button.disabled}
              className={`
                h-12 
                text-lg font-medium
                bg-gradient-to-b from-gray-50 to-gray-300
                hover:from-gray-300 hover:to-gray-400
                active:from-gray-400 active:to-gray-500
                text-gray-800
                shadow-md active:shadow-sm
                transition-all duration-100
                disabled:opacity-50 disabled:cursor-not-allowed
                ${button.className || ""}
              `}
              onClick={() => handleButtonClick(button)}
            >
              {button.display}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
