import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import {
  MatPaginator, MatTableDataSource, PageEvent,
  MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() set pageSize(v: number) {
    this.paginator.pageSize = v;
  }
  @Input() set page(v: number) {
    this.paginator.pageIndex = v;
  }
  @Input() query = '*';
  contacts = new MatTableDataSource<Contact>();
  displayedColumns = ['position', 'name', 'delete'];

  constructor(private contactService: ContactService) { }

  ngAfterViewInit() {
    let lastPageSize = this.paginator.pageSize;
    this.paginator.page.subscribe((event: PageEvent) => {
      if (event.pageSize !== lastPageSize) {
        this.paginator.pageIndex = 0;
        lastPageSize = event.pageSize;
      }
      this.getContacts();
    });
    this.page = 0;
    this.getContacts();
  }

  getId(index: number, contact: Contact) {
    return contact._id;
  }

  getContacts() {
    this.contactService
      .getContacts(this.paginator.pageSize, this.paginator.pageIndex, this.query)
      .subscribe(({ size, items }) => {
        this.contacts.data = items;
        this.paginator.length = size;
      });
  }

  delete(contact: Contact): void {
    const index = this.contacts.data.findIndex(x => x === contact);
    this.contactService.deleteContact(contact.name).subscribe(response => {
      this.contacts.data.splice(index, 1);
      this.contacts._updateChangeSubscription();
      this.paginator.length -= 1;
    });

  }
}
