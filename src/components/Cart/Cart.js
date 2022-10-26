import React, { useContext, useState } from "react"
import classes from "./Cart.module.css"
import Modal from "./../UI/Modal"
import CartContext from "../../store/cart-context"
import CartItem from "./CartItem"
import Checkout from "./Checkout"

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false)
  const [isSubmitting, setIssubmitting] = useState(false)
  const [didSubmit, setDidSubmit] = useState(false)
  const cartCtx = useContext(CartContext)

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
  const hasItems = cartCtx.items.length > 0

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id)
  }

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 })
    console.log(item)
  }

  const orderhandler = () => {
    setIsCheckout(true)
  }

  const submitOrderHander = async (userData) => {
    setIssubmitting(true)
    const response = await fetch(
      "https://react-http-b976c-default-rtdb.firebaseio.com/order.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItem: cartCtx.items,
        }),
      }
    )
    setIssubmitting(false)
    setDidSubmit(true)

    cartCtx.clearCart()
  }

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => {
        return (
          <CartItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={cartItemRemoveHandler.bind(null, item.id)}
            onAdd={cartItemAddHandler.bind(null, item)}
          />
        )
      })}
    </ul>
  )

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.hideCartHandler}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderhandler}>
          Order
        </button>
      )}
    </div>
  )

  const cartModalContent = (
    <>
      {cartItems}
      <div>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onConfirm={submitOrderHander} onCancel={props.hideCartHandler} />}
      {!isCheckout && modalActions}
    </>
  )

  const isSubmittingModalContent = <p>Sending order data...</p>
  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.hideCartHandler}>
          Close
        </button>
      </div>
    </>
  )

  return (
    <Modal hideCartHandler={props.hideCartHandler}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  )
}

export default Cart
