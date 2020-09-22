import { Component, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Product } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { map } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsComponentRef } from 'ngx-bootstrap/component-loader';
import { OrderInfo, OrderService, ProductInfo } from 'src/app/services/order/order.service';
import { Router } from '@angular/router';

interface CartItem {
  product: Product
  quantity: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart;
  total=0;
  cartItems: CartItem[] = [];
  cartSubscription : Subscription;
  modalRef : BsModalRef;

  constructor(private cartService: CartService, private productService: ProductService,
               private modalService: BsModalService, private orderService : OrderService,
               private router : Router) { }

  ngOnInit(): void {
    this.subscribeCart();

  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();

  }

  subscribeCart() {
    let total = 0;
    this.cartSubscription = this.cartService.cartObservable.subscribe({
      next: (cart) => {
        // this.cartItems = [];
        let observables = [];
        total = 0;
        if(Object.keys(cart).length == 0){
          this.cartItems = [];
        }
        for (let id in cart) {
          console.log(id);

          observables.push(
            this.productService.getProductById(id)
              .pipe(
                map(product => {
                  total += product.price * cart[id];
                  let item: CartItem = {
                    product: product,
                    quantity: cart[id]
                  }
                  return item;
                })
              )
          )

        }
        // this.cart = cart;
        forkJoin(observables).subscribe({
          next: (cartItems: CartItem[]) => {
            // console.log(result);
            this.total = total;
            this.cartItems = cartItems;
          }
        })
      }
    })

  }

  //open modal
  openModal(form){
    this.modalRef = this.modalService.show(form, 
      {
        animated : true,
        class : 'modal-lg'
      });
  }

  //checkout button handler

  checkout(event :  Event, form:HTMLFormElement){
    event.preventDefault();
    let firstName = (<HTMLInputElement>form.elements.namedItem('firstName')).value;
    let lastName = (<HTMLInputElement>form.elements.namedItem('lastName')).value;
    let address = (<HTMLInputElement>form.elements.namedItem('address')).value;

    let orderInfo : OrderInfo;
    let productInfos : ProductInfo[] = [];
    this.cartItems.forEach(e=>{
      productInfos.push({
        price: e.product.price,
        productId: e.product._id,
        quantity: e.quantity
      })
    })

    orderInfo = {
      firstName,
      lastName,
      address,
      products:productInfos
    }
    console.log({
      orderInfo
    });

    this.orderService.placeOrder(orderInfo)
    .subscribe({
      next:(result)=>{
        this.modalRef.hide();
        this.cartService.clearCart();
        // this.cartService.cartObservable.subscribe({
        //   next:(cart)=>{
        //     this.quantity = 0;
        //   }
        // })
        this.router.navigate(['orders']);
      },
      error : (err)=>{
        console.log({'err' : 'Cant place order .. '});
        
      }
    })

    return false;
    
  }



}
