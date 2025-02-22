import React from "react";

export const Button = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  return <button ref={ref} {...props} />;
});
