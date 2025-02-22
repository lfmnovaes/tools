import React from "react";

const createIconMock = (name: string) => {
  return function IconMock() {
    return <span data-testid={`icon-${name}`}>{name}</span>;
  };
};

export const AsteriskIcon = createIconMock("asterisk");
export const ChevronUpIcon = createIconMock("chevron-up");
export const DivideIcon = createIconMock("divide");
export const MinusIcon = createIconMock("minus");
export const PlusIcon = createIconMock("plus");
export const PercentIcon = createIconMock("percent");
export const RadicalIcon = createIconMock("radical");
export const EqualIcon = createIconMock("equal");
export const PiIcon = createIconMock("pi");
