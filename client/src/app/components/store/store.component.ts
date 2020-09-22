import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Product } from 'src/app/models/products';
import { ProductService } from 'src/app/services/product/product.service'

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  products : Product[] = [];
  constructor(private productServcie:ProductService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next : (paramMap : ParamMap)=>{
        let categoryId = paramMap.get('category');
        console.log(categoryId);
        this.collectProducts({category:categoryId});
      }
    })
    
  }

  collectProducts(params){
    this.productServcie.getAllProducts(params)
    .subscribe({
      next:(products)=>{
        this.products = products;
        console.log(this.products);
        
        
      },
      error : (error)=>{
        console.log(error);
      }
    })
  }

}
