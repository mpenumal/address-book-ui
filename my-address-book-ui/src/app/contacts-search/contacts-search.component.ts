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
  styleUrls: ['./contacts-search.component.scss']
})
export class ContactsSearchComponent implements OnInit {
  pageSize: number;
  page: number;
  query = '*';
  displayedColumns = ['position', 'name', 'delete'];

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }
}
