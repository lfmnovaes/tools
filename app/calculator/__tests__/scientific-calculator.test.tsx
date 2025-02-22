import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScientificCalculator } from "../scientific-calculator";

describe("ScientificCalculator", () => {
  const mockOnButtonClick = jest.fn();

  beforeEach(() => {
    mockOnButtonClick.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders all calculator buttons", () => {
    render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

    // Check for number buttons
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }

    // Check for basic operators
    expect(screen.getByTestId("icon-plus")).toBeInTheDocument();
    expect(screen.getByTestId("icon-minus")).toBeInTheDocument();
    expect(screen.getByTestId("icon-equal")).toBeInTheDocument();
  });

  it("calls onButtonClick with correct value when number buttons are clicked", () => {
    render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

    fireEvent.click(screen.getByText("7"));
    expect(mockOnButtonClick).toHaveBeenCalledWith("7", false);
  });

  it("handles clear button correctly", () => {
    render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

    fireEvent.click(screen.getByText("C"));
    expect(mockOnButtonClick).toHaveBeenCalledWith("", true);
  });

  it("handles function buttons with cursor positioning", () => {
    render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

    // Find the button containing the sqrt icon
    const sqrtButton = screen.getByTestId("icon-radical").closest("button");
    fireEvent.click(sqrtButton!);

    // Verify that the function is split into two parts with correct cursor positioning
    expect(mockOnButtonClick).toHaveBeenCalledTimes(2);
    expect(mockOnButtonClick).toHaveBeenNthCalledWith(1, "sqrt(", false);
    expect(mockOnButtonClick).toHaveBeenNthCalledWith(2, ")", true);
  });

  it("handles sqrt button followed by number input correctly", () => {
    const mockCursorHandler = jest.fn();
    render(<ScientificCalculator onButtonClick={mockCursorHandler} />);

    // Click sqrt button
    const sqrtButton = screen.getByTestId("icon-radical").closest("button");
    fireEvent.click(sqrtButton!);

    // Verify that the function is split into two parts with correct cursor positioning
    expect(mockCursorHandler).toHaveBeenCalledTimes(2);
    expect(mockCursorHandler).toHaveBeenNthCalledWith(1, "sqrt(", false);
    expect(mockCursorHandler).toHaveBeenNthCalledWith(2, ")", true);

    // Click number 9
    fireEvent.click(screen.getByText("9"));

    // The number should be inserted at the cursor position (between parentheses)
    expect(mockCursorHandler).toHaveBeenNthCalledWith(3, "9", false);
  });

  describe("Complex function interactions", () => {
    it("handles nested function calls correctly", () => {
      render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

      // Click sin button
      const sinButton = screen.getAllByText("sin")[0];
      fireEvent.click(sinButton);

      // Verify sin( is added first
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(1, "sin(", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(2, ")", true);

      // Click sqrt button inside sin
      const sqrtButton = screen.getByTestId("icon-radical").closest("button");
      fireEvent.click(sqrtButton!);

      // Verify sqrt( is added inside sin
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(3, "sqrt(", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(4, ")", true);
    });

    it("handles multiple function buttons in sequence", () => {
      render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

      // Click log button
      const logButton = screen.getByText("log");
      fireEvent.click(logButton);

      // Verify log( is added
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(1, "log(", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(2, ")", true);

      // Click number
      fireEvent.click(screen.getByText("2"));
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(3, "2", false);

      // Click multiply
      const multiplyButton = screen.getByTestId("icon-asterisk").closest("button");
      fireEvent.click(multiplyButton!);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(4, "*", false);

      // Click pi
      const piButton = screen.getByTestId("icon-pi").closest("button");
      fireEvent.click(piButton!);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(5, "pi", false);
    });

    it("handles trigonometric functions correctly", () => {
      render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

      // Test all trig functions
      const trigFunctions = ["sin", "cos", "tan"];

      trigFunctions.forEach((func, index) => {
        const button = screen.getAllByText(func)[0];
        fireEvent.click(button);

        const baseCall = index * 2;
        expect(mockOnButtonClick).toHaveBeenNthCalledWith(baseCall + 1, `${func}(`, false);
        expect(mockOnButtonClick).toHaveBeenNthCalledWith(baseCall + 2, ")", true);
      });
    });

    it("handles exponential and logarithmic functions", () => {
      render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

      // Test exp function
      const expButton = screen.getByText("exp");
      fireEvent.click(expButton);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(1, "exp(", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(2, ")", true);

      // Test ln function
      const lnButton = screen.getByText("ln");
      fireEvent.click(lnButton);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(3, "ln(", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(4, ")", true);

      // Add a number and test power operator
      fireEvent.click(screen.getByText("2"));
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(5, "2", false);

      const powerButton = screen.getByTestId("icon-chevron-up").closest("button");
      fireEvent.click(powerButton!);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(6, "^", false);
    });

    it("handles parentheses and decimal points correctly", () => {
      render(<ScientificCalculator onButtonClick={mockOnButtonClick} />);

      // Click open parenthesis
      fireEvent.click(screen.getByText("("));
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(1, "(", false);

      // Add a decimal number
      fireEvent.click(screen.getByText("1"));
      fireEvent.click(screen.getByText("."));
      fireEvent.click(screen.getByText("5"));
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(2, "1", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(3, ".", false);
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(4, "5", false);

      // Close parenthesis
      fireEvent.click(screen.getByText(")"));
      expect(mockOnButtonClick).toHaveBeenNthCalledWith(5, ")", false);
    });

    it("handles function input followed by number correctly", () => {
      const mockCursorHandler = jest.fn();
      render(<ScientificCalculator onButtonClick={mockCursorHandler} />);

      // Click sin button
      const sinButton = screen.getAllByText("sin")[0];
      fireEvent.click(sinButton);

      // Verify that the function is split into two parts with correct cursor positioning
      expect(mockCursorHandler).toHaveBeenCalledTimes(2);
      expect(mockCursorHandler).toHaveBeenNthCalledWith(1, "sin(", false);
      expect(mockCursorHandler).toHaveBeenNthCalledWith(2, ")", true);

      // Click number 5
      fireEvent.click(screen.getByText("5"));

      // The number should be inserted at the cursor position (between parentheses)
      expect(mockCursorHandler).toHaveBeenNthCalledWith(3, "5", false);

      // Clean up before next render
      cleanup();

      // Verify the final state would be sin(5) by checking the parent component's behavior
      const mockParentHandler = jest.fn();
      let expression = "";
      let cursorPosition = 0;

      const parentHandler = (value: string, shouldMoveCursor?: boolean) => {
        if (value === "") {
          expression = "";
          cursorPosition = 0;
          return;
        }

        if (shouldMoveCursor) {
          // When shouldMoveCursor is true, we're receiving the closing parenthesis
          // Save the current position as the cursor position
          cursorPosition = expression.length;
        } else {
          // Insert at cursor position if it's not at the end
          if (cursorPosition < expression.length) {
            expression =
              expression.slice(0, cursorPosition) + value + expression.slice(cursorPosition);
            cursorPosition += value.length;
          } else {
            expression += value;
            cursorPosition = expression.length;
          }
        }
        mockParentHandler(value, shouldMoveCursor);
      };

      render(<ScientificCalculator onButtonClick={parentHandler} />);

      // Simulate the same sequence
      const sinBtn = screen.getAllByText("sin")[0];
      fireEvent.click(sinBtn);
      fireEvent.click(screen.getByText("5"));

      // The final expression should be "sin(5"
      expect(expression).toBe("sin(5");
    });

    it("positions cursor correctly between parentheses for function buttons", () => {
      // Mock the input element and its selection
      const inputElement = document.createElement("input");
      let cursorPosition = 0;
      let fullExpression = "";
      type EventLogEntry = { value: string; shouldMoveCursor: boolean };
      let eventLog: EventLogEntry[] = [];

      const mockParentHandler = (value: string, shouldMoveCursor?: boolean) => {
        if (value === "") {
          inputElement.value = "";
          cursorPosition = 0;
          fullExpression = "";
          eventLog = [];
          return;
        }

        // Log each event for detailed verification
        eventLog.push({ value, shouldMoveCursor: shouldMoveCursor || false });

        if (shouldMoveCursor && value === ")") {
          // For closing parenthesis with shouldMoveCursor, append it and position cursor before it
          fullExpression += value;
          inputElement.value = fullExpression;
          cursorPosition = fullExpression.length - 1;
          inputElement.setSelectionRange(cursorPosition, cursorPosition);
        } else {
          // For all other inputs, insert at current cursor position
          fullExpression =
            fullExpression.slice(0, cursorPosition) + value + fullExpression.slice(cursorPosition);
          inputElement.value = fullExpression;
          cursorPosition += value.length;
          inputElement.setSelectionRange(cursorPosition, cursorPosition);
        }
      };

      // Add the input element to the document
      document.body.appendChild(inputElement);

      render(<ScientificCalculator onButtonClick={mockParentHandler} />);

      // Test a single function button in detail
      mockParentHandler("", true);

      // Click the sin button
      const sinButton = screen.getAllByText("sin")[0];
      fireEvent.click(sinButton);

      // Verify exact sequence of events
      expect(eventLog).toEqual([
        // Should receive sin( first, with shouldMoveCursor false
        { value: "sin(", shouldMoveCursor: false },
        // Should receive ) second, with shouldMoveCursor true
        { value: ")", shouldMoveCursor: true },
      ]);

      // Verify cursor is positioned between parentheses
      expect(inputElement.value).toBe("sin()");
      expect(cursorPosition).toBe(4); // Should be at index 4 (between parentheses)

      // Now click 5
      fireEvent.click(screen.getByText("5"));

      // Verify 5 is inserted at cursor position (between parentheses)
      expect(inputElement.value).toBe("sin(5)");
      expect(cursorPosition).toBe(5); // Should be after the 5

      // Clean up
      document.body.removeChild(inputElement);
    });
  });
});
