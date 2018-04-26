import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ContactService } from '../contact.service';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../contact';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: ['./contacts-search.component.css']
})
export class ContactsSearchComponent implements OnInit {

  pageSize: number;
  page: number;
  query: string;
  contacts = new MatTableDataSource<Contact>();

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  search(): void {
    this.contactService
      .getContacts()
      .subscribe(stream => {
        this.contacts = new MatTableDataSource(stream);
        this.contacts.paginator = this.paginator;
      });
  }
}
