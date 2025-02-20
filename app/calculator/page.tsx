"use client";

import { useState, useRef, useEffect } from "react";
import { evaluate } from "mathjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HistoryItem = {
  expression: string;
  result: string;
};

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const evaluateExpression = (): string => {
    try {
      const result = evaluate(expression);
      return result.toString();
    } catch {
      return "Error";
    }
  };

  const handleSubmit = () => {
    if (!expression.trim()) return;
    const result = evaluateExpression();
    setHistory((prev) => [...prev, { expression, result }]);
    setExpression("");
  };

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 relative">
      <div ref={resultsRef} className="overflow-y-auto pb-24 pt-4 px-4">
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="text-xl text-gray-300">{item.expression}</div>
            <div className="text-2xl font-bold">{item.result}</div>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-900 p-4 fixed bottom-0 left-0">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter expression (e.g. 1+4^2)"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 h-12 !text-2xl"
          />
          <Button className="h-12" variant="destructive" onClick={() => setExpression("")}>
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
