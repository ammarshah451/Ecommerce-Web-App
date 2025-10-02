import { Dialog } from "@mui/material";
import React, { useState } from "react";
import { SpecificProductRenderer } from "../shared/SharedComponents";

const SpecificProduct = ({ product, open, handlerClose, addToCart }) => {
  const [count, setCount] = useState(1);
  const handleIncrement = () => setCount(count + 1);

  const handleDecrement = () => {
    if (count > 1) setCount(count - 1);
  };

  return (
    <Dialog open onClose={handlerClose} maxWidth={"md"} fullWidth>
      <SpecificProductRenderer
        product={product}
        handlerClose={handlerClose}
        count={count}
        handleDecrement={handleDecrement}
        handleIncrement={handleIncrement}
        addToCart={addToCart}
      />
    </Dialog>
  );
};

export { SpecificProduct };
