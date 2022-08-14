import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

interface CartItemsAmount {
  [key: number]: number;
} 

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');//Buscar dados do localStorage   
    
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  // useEffect(() => {
    
  // }, [cart]);

  // ADICIONANDO PRODUTOS NO CARRINHO
  const addProduct = async (productId: number) => {
    try {
      // TODO

      if (!productId) {
        return;
      }
      
      const resultadoStock = await api.get('/stock/' + productId) ;
      const estoque = resultadoStock.data;

      // ATUALIZA PRODUTO SE EXISTIR NO CARRINHO
      var resultado = false;   
      var saldoLimite = false;

      const newShopCart = cart.map((item) =>{
        if (item.id === productId) {                    
          if (estoque.amount > item.amount) {
            item.amount = item.amount + 1;  
            resultado = true;             
          } else {
            toast.error('Quantidade solicitada fora de estoque');  
            saldoLimite = true;                      
          }                  
        }              
        return item; 
      })

      if (saldoLimite) {
        return;
      }
    
      //ADICIONA O PRODUTO NO CARRINHO QUANDO NÃO EXISTE
      if (resultado === false) {
        const response = await api.get('/products/' + productId)  
        const { data } = response;
      
        const newShopCart = {
          id: productId,
          title: data.title,
          price: data.price,
          image: data.image,
          amount: 1,
        }
        
        if (estoque.amount >= newShopCart.amount ) {
          const carrinhoAtual = [...cart];                
          carrinhoAtual.push(newShopCart);
          setCart(carrinhoAtual);

          // ARMAZENANDO OS ITENS COMPRADOS NO CARRINHO COM ATUALIZAÇÃO DE TELA
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(carrinhoAtual)); 
        } else {
          toast.error('Quantidade solicitada fora de estoque');
        }        
      } else {
        setCart(newShopCart)    
        // ARMAZENANDO OS ITENS COMPRADOS NO CARRINHO COM ATUALIZAÇÃO DE TELA
        //JSON.strigify converte objeto em string
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newShopCart));           
      }  

    } catch {
      // TODO
      toast.error('Erro na adição do produto');      
    }
  };

  // REMOVENDO UM PRODUTO DO CARRINHO
  const removeProduct = (productId: number) => {
    try {
      // TODO     
           
      const indexCarrinho = cart.findIndex(carrinho => carrinho.id === productId)

      if (indexCarrinho > -1) {         

        const productDeleted = cart.filter(item =>{
          return item.id !== productId;
        })
        setCart(productDeleted)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(productDeleted));

      } else {
        throw Error();
      }

    } catch {
      // TODO
      toast.error('Erro na remoção do produto');
    }
  };

  // ATUALIZANDO AS COMPRAS DO CARRINHO PARA MAIS OU MENOS
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO 
      if (amount < 1) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      // não deve ser capaz de atualizar uma quantidade de produto quando ficar sem estoque
      var saldoAtualizado = amount;

      const resultadoStock = await api.get('/stock/' + productId) ;
      const estoque = resultadoStock.data;

      var newUpdate = false;
      const newProductAmount = cart.map((item) => {
        if (item.id === productId) {          
          if (estoque.amount >= saldoAtualizado) {
            item.amount = saldoAtualizado;     
            newUpdate = true;              
          } else {
            toast.error('Quantidade solicitada fora de estoque');                        
          }                    
        }              
        return item;
      })  

      if (newUpdate) {
        setCart(newProductAmount)  
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newProductAmount)); 
      }
           
    } catch {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
