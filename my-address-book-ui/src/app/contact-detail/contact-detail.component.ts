import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ContactService } from '../contact.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  @Input()
  contact: Contact;

  @Input()
  message: string;

  newContact: Contact = { name: '', phone: 0, city: '' };

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getContact();
  }

  getContact(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.contactService.getContact(name)
      .subscribe(x => this.contact = x);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.contactService.updateContact(this.contact)
      .subscribe(() => this.goBack());
    this.snackBar.open('Contact update successful!', '', {
      duration: 3000,
    });
  }

  add() {
    this.contactService.addContact(this.newContact)
      .subscribe(() => this.goBack());
    this.snackBar.open('Contact create successful!', '', {
      duration: 3000,
    });
  }

  cancel(): void {
    this.goBack();
    this.snackBar.open('Nothing changed :(', '', {
      duration: 3000,
    });
  }
}
