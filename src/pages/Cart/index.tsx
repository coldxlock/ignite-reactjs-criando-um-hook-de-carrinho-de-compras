import React, { useEffect, useState } from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { ProductList } from '../Home/styles';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  
  // const cartFormatted = cart.map(product => ({
  //   // TODO
  //   product.price    
  // })) 

  // CALCULANDO O TOTAL GERAL DE COMRPAS NO CARRINHO
  const total = cart.reduce((sumTotal, product) => {
    sumTotal += product.price * product.amount;   
   
    return sumTotal;
  }, 0) 

  function handleProductIncrement(product: Product) {                 
    // // TODO
    const increment = {
      productId: product.id,
      amount: product.amount +1
    }

    updateProductAmount(increment)
   
  }

  function handleProductDecrement(product: Product) {   
    // TODO
    const decrement = {
      productId: product.id,
      amount: product.amount -1
    }

    updateProductAmount(decrement)
  }

  function handleRemoveProduct(productId: number) {
    // TODO        
    removeProduct(productId);  
  }

  // useEffect(() => {
  //   console.log('total', total)
  // }, [total]);

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {/* LISTANDO AS COMPRAS FEITAS NO CARRINHO */}
          {cart.map((productCarrinho) => {
            return(
              <tr data-testid="product" key={productCarrinho.id}>
              <td>
                <img src={productCarrinho.image} alt="" />
              </td>
              <td>
                <strong>{productCarrinho.title}</strong>
                <strong>
                  {formatPrice(productCarrinho.price)}                      
                </strong>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                  disabled={productCarrinho.amount <= 1}
                  onClick={() => handleProductDecrement(productCarrinho)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={productCarrinho.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                  onClick={() => handleProductIncrement(productCarrinho)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>
                  {/* CALCULANDO O SUBTOTAL DOS PRODUTOS NO CARRINHO */}
                  {formatPrice(productCarrinho.price * productCarrinho.amount)}                      
                </strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                onClick={() => handleRemoveProduct(productCarrinho.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
            )
          })}
          
        </tbody>
      </ProductTable>
      
      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(total)}
            {/* {total} */}
          </strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
