import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Category } from 'src/app/models/category';
 
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getUrl = 'http://localhost/api/categories'

  constructor(private http : HttpClient) { }

  getAllCategories(){
    return this.http.get(this.getUrl)
    .pipe(
      map(result=>{
        return <Category[]>result['categories']
      })
    );
  }
}
