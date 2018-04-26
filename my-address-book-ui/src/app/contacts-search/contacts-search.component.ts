import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ContactService } from '../contact.service';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../contact';
import { MatSort, MatTableDataSource } from '@angular/material';

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
  displayedColumns = ['position', 'name', 'delete'];

  @ViewChild(MatSort) sort: MatSort;

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
      .getContacts(this.pageSize, this.page, this.query)
      .subscribe(({ items, size }) => {
        // this.contacts = new MatTableDataSource(stream);
        this.contacts.sort = this.sort;
      });
  }

  delete(contact: Contact): void {
    this.contacts.filterPredicate = (data: Contact, filter: string) => {
      return data.name !== filter;
    };
    this.contacts.filter = contact.name;
    this.contactService.deleteContact(contact.name).subscribe();
  }
}
