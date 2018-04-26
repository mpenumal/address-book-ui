import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ContactService {
  private contactsUrl = 'http://localhost:3000/contacts';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log(message: string) {
    this.messageService.add('ContactService: ' + message);
  }

  getContacts(pageSize: number = 100, page: number = 0, query: string = '*'): Observable<Contact[]> {
    const url = `${this.contactsUrl}/?pageSize=${pageSize}&page=${page}&query=${query}`;
    return this.http.get<Contact[]>(url)
      .pipe(
        tap(contacts => this.log(`Fetched Contacts`)),
        catchError(this.handleError('getContacts', []))
      );
  }

  getContact(name: string): Observable<Contact> {
    const url = `${this.contactsUrl}/${name}`;
    return this.http.get<Contact>(url).pipe(
      tap(_ => this.log(`Fetched Contact name=${name}`)),
      catchError(this.handleError<Contact>(`getContact name=${name}`))
    );
  }

  addContact(contact: Contact): Observable<any> {
    const url = `${this.contactsUrl}/`;
    return this.http.post(url, contact, httpOptions).pipe(
      tap(_ => this.log(`Added contact name=${contact.name}`)),
      catchError(this.handleError<any>('addContact'))
    );
  }

  updateContact(contact: Contact): Observable<any> {
    const url = `${this.contactsUrl}/${contact.name}`;
    return this.http.put(url, contact, httpOptions).pipe(
      tap(_ => this.log(`Updated contact name=${contact.name}`)),
      catchError(this.handleError<any>('updateContact'))
    );
  }

  deleteContact(contact: Contact | string): Observable<Contact> {
    const name = typeof contact === 'string' ? contact : contact.name;
    const url = `${this.contactsUrl}/${name}`;
    return this.http.delete<Contact>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted contact name=${name}`)),
      catchError(this.handleError<Contact>('deleteContact'))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
