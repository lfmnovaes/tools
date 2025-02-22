"use client";

import { useState, useRef } from "react";
import { evaluate } from "mathjs";
import { useLocalStorage } from "react-use";
import { CalculatorIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScientificCalculator } from "./scientific-calculator";

type ResultItem = {
  expression: string;
  result: string;
};

type StyledPart = {
  text: string;
  className: string;
};

const styleExpression = (expression: string): StyledPart[] => {
  const parts: StyledPart[] = [];
  let currentNumber = "";
  const addPart = (text: string, className: string) => parts.push({ text, className });
  const addNumber = () => {
    if (currentNumber) {
      addPart(currentNumber, "text-white");
      currentNumber = "";
    }
  };
  for (const char of expression) {
    if (/[0-9.]/.test(char)) {
      currentNumber += char;
      continue;
    }
    addNumber();
    const className = (() => {
      switch (true) {
        case /[\+\-\*\/]/.test(char): // Basic operators: + - * /
          return "text-yellow-500";
        case /[\(\)]/.test(char): // Parentheses: ( )
          return "text-pink-400";
        case /[!%^]/.test(char): // Special operators: ! % ^
          return "text-orange-400";
        case /[<>=]/.test(char): // Comparison operators: < > =
          return "text-green-400";
        case /[|&]/.test(char): // Logical operators: | &
          return "text-blue-400";
        case /[a-zA-Z]/.test(char): // Functions and variables
          return "text-purple-400";
        default: // Other characters
          return "text-gray-400";
      }
    })();
    addPart(char, className);
  }
  addNumber();
  return parts;
};

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [results, setResults] = useLocalStorage<ResultItem[]>("calc-results", []);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const evaluateExpression = (): string => {
    try {
      const result = evaluate(expression);
      return result.toString();
    } catch (error) {
      console.error(error);
      return "Error";
    }
  };

  const handleSubmit = () => {
    if (!expression.trim()) return;
    const result = evaluateExpression();

    const currentResults = results ?? [];
    const maxItems = 100;
    const newResults = [...currentResults, { expression, result }];
    if (newResults.length > maxItems) {
      newResults.shift();
    }
    setResults(newResults);

    setInputHistory((prev) => {
      const newHistory = [...prev, expression];
      setHistoryIndex(newHistory.length);
      return newHistory;
    });
    setExpression("");

    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setExpression("");
      setHistoryIndex(inputHistory.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length > 0) {
        let newIndex = historyIndex;
        if (historyIndex === inputHistory.length) {
          newIndex = inputHistory.length - 1;
        } else if (historyIndex > 0) {
          newIndex = historyIndex - 1;
        }
        setHistoryIndex(newIndex);
        setExpression(inputHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < inputHistory.length) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setExpression(newIndex === inputHistory.length ? "" : inputHistory[newIndex]);
      }
    }
  };

  const handleCalculatorButton = (value: string, shouldMoveCursor?: boolean) => {
    if (value === "=") {
      handleSubmit();
    } else {
      if (value === "") {
        // Clear button was pressed
        setExpression("");
        setHistoryIndex(inputHistory.length);
        return;
      }

      if (inputRef.current) {
        const cursorPos = inputRef.current.selectionStart || 0;
        const currentValue = inputRef.current.value;

        if (shouldMoveCursor && value === ")") {
          // For closing parenthesis with shouldMoveCursor, insert it and position cursor before it
          setExpression((prev) => {
            const newExpression = prev + value;
            // Use setTimeout to ensure the DOM has updated
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                const newPos = newExpression.length - 1; // Position before the closing parenthesis
                inputRef.current.setSelectionRange(newPos, newPos);
              }
            }, 0);
            return newExpression;
          });
        } else {
          // For all other inputs, insert at current cursor position
          setExpression(() => {
            const newExpression =
              currentValue.slice(0, cursorPos) + value + currentValue.slice(cursorPos);

            // Use setTimeout to ensure the DOM has updated
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                const newPos = cursorPos + value.length;
                inputRef.current.setSelectionRange(newPos, newPos);
              }
            }, 0);
            return newExpression;
          });
        }
      } else {
        // Fallback if ref is not available
        setExpression((prev) => prev + value);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-800 text-gray-100">
      <div ref={resultsRef} className="flex-1 overflow-y-auto px-4">
        <div className="min-h-full flex flex-col justify-end">
          <div className="flex flex-col">
            {(results ?? []).map((item, index) => (
              <div key={index} className="mb-4 font-mono">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl">
                    {styleExpression(item.expression).map((part, i) => (
                      <span key={i} className={part.className}>
                        {part.text}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-gray-400 text-xl">=</span>
                  <span className="text-cyan-500 text-2xl">{item.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-900 border-t border-neutral-700">
        {showCalculator && <ScientificCalculator onButtonClick={handleCalculatorButton} />}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter expression (e.g. 1+4^2)"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-12 !text-2xl bg-neutral-900 border-neutral-700 text-gray-100 selection:bg-gray-300 selection:text-gray-900"
            />
            <Button
              className={`
                h-12 w-12
                ${
                  showCalculator
                    ? "bg-blue-400/90 hover:bg-blue-500/90"
                    : "bg-neutral-700/90 hover:bg-neutral-600/90"
                }
                shadow-lg
                transition-all duration-200
              `}
              variant="outline"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <CalculatorIcon className="h-5 w-5 text-white" />
            </Button>
            <Button
              className="h-12"
              variant="destructive"
              onClick={() => {
                setExpression("");
                setHistoryIndex(inputHistory.length);
              }}
            >
              Cancel
            </Button>
            <Button className="h-12" variant="secondary" onClick={handleSubmit}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
