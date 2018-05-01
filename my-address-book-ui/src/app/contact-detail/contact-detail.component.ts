import { Component, OnInit, Input, Inject } from '@angular/core';
import { Contact } from '../contact';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ContactService } from '../contact.service';
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  @Input()
  contact: Contact;

  @Input()
  message: string;

  newContact: Partial<Contact> = {};

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ContactDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getContact();

  }

  getContact(): void {
    // const contact = this.route.snapshot.paramMap.get('contact');
    if (this.data && this.data.editContact) {
      this.contact = this.data.editContact;
    }
  }

  save(): void {
    this.contactService.updateContact(this.contact)
      .subscribe(() => this.onNoClick());
    this.snackBar.open('Contact update successful!', '', {
      duration: 3000,
    });
  }

  add() {
    this.contactService.addContact(this.newContact as Contact)
      .subscribe(() => this.onNoClick());
    this.snackBar.open('Contact create successful!', '', {
      duration: 3000,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
