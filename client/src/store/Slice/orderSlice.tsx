import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  order: any[];
} = {
  order: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder(state, action) {
      state.order.push(action.payload);
    },
    getOrder(state, action) {
      state.order = action.payload;
    },

    deleteOrder(state, action) {
      state.order = state.order.filter((item) => item._id !== action.payload);

      console.log("Удаляем:", action.payload);
    },

    plusOrder(state, action) {
      const { id } = action.payload;
      const product = state.order.find((item) => item._id === id);
      if (product) {
        product.quantity = (product.quantity || 1) + 1; // Увеличиваем количество
      }
    },
    minusOrder(state, action) {
      const { id } = action.payload;
      const product = state.order.find((item) => item._id === id);
      if (product && product.quantity > 1) {
        product.quantity -= 1; // Уменьшаем количество
      }
    },
    clearOrder(state) {
      state.order = [];
    },
  },
});

export const { addOrder, getOrder, deleteOrder, plusOrder, minusOrder, clearOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
