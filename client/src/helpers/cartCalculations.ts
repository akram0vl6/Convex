import { minusOrder, plusOrder } from "../store/Slice/orderSlice";
import { Product } from "./taype";

export const calculateTotalWeight = (selector: Product[]) => {
  return selector.reduce(
    (acc, item) => acc + item.weight * (item.quantity || 1),
    0
  );
};

export const calculateTotalItems = (selector: Product[]) => {
  return selector.reduce((acc, item) => acc + (item.quantity || 1), 0);
};

export const handlePlus = (dispatch: any, id: string) => {
  dispatch(plusOrder({ id }));
};

export const handleMinus = (dispatch: any, id: string) => {
  dispatch(minusOrder({ id }));
};
