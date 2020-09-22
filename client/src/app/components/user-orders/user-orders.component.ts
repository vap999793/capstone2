import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {

  orders : Order[] = [];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {

    this.collectOrders()
  }

  collectOrders(){
    this.orderService.getUserOrders()
    .subscribe({
      next : (orders)=>{
        console.log(orders);
        this.orders = orders;
        
      }
    })
  }
}
