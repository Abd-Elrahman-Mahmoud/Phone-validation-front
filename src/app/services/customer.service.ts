import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class CustomerService {
    constructor(private http: HttpClient) {}

    getAllCustomers = (filter: any, page: number) =>{
        return this.http.get(`http://localhost:8080/phone-validation/customer?page=${page}`);
    }
    
    filterByCountry = (countryName: any, page: number) =>{
        return this.http.get(`http://localhost:8080/phone-validation/customer/country/${countryName}?page=${page}`);
    }
    
    filterByState = (state: any, page: number) =>{
        return this.http.get(`http://localhost:8080/phone-validation/customer/state/${state}?page=${page}`);
    }
}