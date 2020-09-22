import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderPlaceUrl = 'http://localhost/api/orders'
  userAllOrdersUrl = 'http://localhost/api/orders'
  constructor(private http : HttpClient, private userService : UserService) { }

  placeOrder(orderInfo : OrderInfo){
    let headers = new HttpHeaders({
      'authorization' : this.userService.getToken()
    })
    return this.http.post(this.orderPlaceUrl, orderInfo, {headers})
  }

  getUserOrders(){
    let headers = new HttpHeaders({
      'authorization' : this.userService.getToken()
    })
    return this.http.get(this.userAllOrdersUrl, {headers}).pipe(
      map((result : {count: number , orders : Order[]})=>{
        return result.orders;
      })
    )
  }
}

export interface OrderInfo{
  firstName: string;
  lastName: string;
  address: string;
  products: ProductInfo[];
}

export interface ProductInfo{
  productId: string;
  quantity: number;
  price: number;
}