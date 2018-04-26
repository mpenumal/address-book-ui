import { Component, OnInit, ViewChild } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts = new MatTableDataSource<Contact>();
  displayedColumns = ['position', 'name', 'delete'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.contactService
      .getContacts()
      .subscribe(stream => {
        this.contacts = new MatTableDataSource(stream);
        this.contacts.paginator = this.paginator;
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
