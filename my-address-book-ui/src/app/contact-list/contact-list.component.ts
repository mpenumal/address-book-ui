import { Component, OnInit, ViewChild, Input, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  MatPaginator, MatTableDataSource, PageEvent,
  MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatSort
} from '@angular/material';
import { merge, combineLatest, map, distinctUntilChanged, takeUntil, multicast, share } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _data = new BehaviorSubject<Contact[]>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private _pageSize = new BehaviorSubject<number>(10);
  private _page = new BehaviorSubject<number>(0);
  private _query = new BehaviorSubject<string>('*');

  private _quit = new EventEmitter<boolean>();

  @Input() set pageSize(v: number) {
    this._pageSize.next(v);
  }

  @Input() set page(v: number) {
    this._page.next(v);
  }

  @Input() set query(v: string) {
    this._query.next(v);
  }

  private _tableChanges: Observable<[string, number, number]>;

  contacts = new MatTableDataSource<Contact>();
  displayedColumns = ['position', 'name', 'phone', 'city', 'action'];

  constructor(private contactService: ContactService, public dialog: MatDialog) { }

  ngOnDestroy() {
    this._quit.emit(true);
  }

  ngOnInit() {
    this.getTableChanges()
      .subscribe(([q, p, ps]) => this.getContacts(q, p, ps));
  }

  ngAfterViewInit() {
    this.connectPaginator();
    this.contacts.sort = this.sort;
  }

  connectPaginator() {
    this.paginator.page
      .pipe(
        takeUntil(this._quit),
        map((x: PageEvent) => x.pageIndex),
        distinctUntilChanged()
      )
      .subscribe(this._page);

    this.paginator.page
      .pipe(
        takeUntil(this._quit),
        map((x: PageEvent) => x.pageSize),
        distinctUntilChanged()
      )
      .subscribe(this._pageSize);

    this.getTableChanges()
      .subscribe(([query, page, pageSize]) => {
        this.paginator.pageIndex = page;
        this.paginator.pageSize = pageSize;
      });
  }

  getTableChanges() {
    if (!this._tableChanges) {
      let lastPageSize = 0;
      let lastQuery = '';

      this._tableChanges = this._query.pipe(
        takeUntil(this._quit),
        combineLatest(
          this._page,
          this._pageSize
        ),
        distinctUntilChanged(),
        map(([query, page, pageSize]) => {
          if (pageSize !== lastPageSize || query !== lastQuery) {
            page = 0;
          }

          lastPageSize = pageSize;
          lastQuery = query;
          return [query, page, pageSize] as [string, number, number];
        }),
        share());
    }
    return this._tableChanges;
  }

  getId(index: number, contact: Contact) {
    return contact._id;
  }

  getContacts(query: string, page: number, pageSize: number) {
    this.contactService
      .getContacts(pageSize, page, query)
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

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ContactDetailComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      location.reload();
    });
  }

  openEditDialog(contact: Contact): void {
    const dialogRef = this.dialog.open(ContactDetailComponent, {
      data: { editContact: contact },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.contacts.filter = filterValue;
  }
}
