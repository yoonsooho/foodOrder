import React from "react"

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
}) //이곳은 비어 있어도 괜찮지만 vs studio의
//ide를 사용해서 편리하게 사용하기 위해서 작성함.

export default CartContext
