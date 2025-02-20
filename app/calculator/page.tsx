"use client";

import { useState, useRef } from "react";
import { evaluate } from "mathjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        case /[\+\-\*\/]/.test(char): return "text-yellow-500";   // Basic operators: + - * /
        case /[\(\)]/.test(char): return "text-pink-400";         // Parentheses: ( )
        case /[!%^]/.test(char): return "text-orange-400";        // Special operators: ! % ^
        case /[<>=]/.test(char): return "text-green-400";         // Comparison operators: < > =
        case /[|&]/.test(char): return "text-blue-400";           // Logical operators: | &
        case /[a-zA-Z]/.test(char): return "text-purple-400";     // Functions and variables
        default: return "text-gray-400";                          // Other characters
      }
    })();

    addPart(char, className);
  }

  addNumber();
  return parts;
};

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setResults((prev) => {
      const newResults = [...prev, { expression, result }];
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
        }
      }, 0);
      return newResults;
    });
    setInputHistory((prev) => {
      const newHistory = [...prev, expression];
      setHistoryIndex(newHistory.length);
      return newHistory;
    });
    setExpression("");
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

  return (
    <div className="flex flex-col h-screen bg-neutral-800 text-gray-100">
      <div
        ref={resultsRef}
        className="flex-1 overflow-y-auto px-4"
      >
        <div className="min-h-full flex flex-col justify-end">
          <div className="flex flex-col">
            {results.map((item, index) => (
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
      <div className="w-full bg-neutral-900 border-t border-neutral-700 p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter expression (e.g. 1+4^2)"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 !text-2xl bg-neutral-900 border-neutral-700 text-gray-100 selection:bg-gray-300 selection:text-gray-900"
          />
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
  );
}
