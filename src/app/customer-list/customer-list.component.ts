import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from "rxjs/operators";
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'phone', 'countryName', 'state'];
  dataSource = new MatTableDataSource<Customer>([]);
  isLoading = true;

  filterForm = new FormGroup({
    countryName: new FormControl(''),
    state: new FormControl(''),
  });

  constructor(private customerService: CustomerService) { }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getCustomers();
    this.filterForm.get('countryName')?.valueChanges.pipe(debounceTime(1000)).subscribe(change => {
      this.getCustomers(this.dataSource.paginator?.pageIndex);
    });
    this.filterForm.get('countryName')?.valueChanges.subscribe(change => {
      this.filterForm.get('state')?.setValue('');
    });
    this.filterForm.get('state')?.valueChanges.subscribe(change => {
      this.getCustomers(this.dataSource.paginator?.pageIndex);
    });
  }

  private getCustomers(page: number = 0) {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource<Customer>([]);
    let api;
    let filter = '';
    if (this.filterForm.get('countryName')?.value.length) {
      api = this.customerService.filterByCountry;
      filter = this.filterForm.get('countryName')?.value;
    } else if (this.filterForm.get('state')?.value.length) {
      api = this.customerService.filterByState;
      filter = this.filterForm.get('state')?.value;
    } else {
      api = this.customerService.getAllCustomers;
    }
    api(filter, 0).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<Customer>(res.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.pageIndex = 0;
      this.dataSource.paginator.length = res.totalElements;
      this.dataSource.paginator.pageSize = 20;
      this.isLoading = false;
    });
  }

  // paginationChange(newPage: any) {
  //   this.getCustomers(newPage.pageIndex);
  // }
}

export interface Customer {
  name: string;
  phone: string;
  countryName: string;
  state: string;
}

