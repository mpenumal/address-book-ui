import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// create a decorator to move the logging and error handling
function RunOperation(target: ContactService, property: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function () {
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    const args_map = args.map((x) => JSON.stringify(x)).join();
    const result = originalMethod.apply(this, args);
    result.pipe(
      tap(_ => this.log(`${target.addContact.name} Successful.`)),
      catchError(this.handleError(target.addContact.name))
    );
    return result;
  };
  return descriptor;
}

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

  @RunOperation
  getContacts(pageSize: number, page: number, query: string) {
    const url = `${this.contactsUrl}/`;
    const params = new HttpParams()
      .set('pageSize', `${pageSize}`)
      .set('page', `${page}`)
      .set('query', `${query}`);
    return this.http
      .get(url, { params: params }) as Observable<{ size: number, items: Contact[] }>;
  }

  @RunOperation
  getContact(name: string): Observable<Contact> {
    const url = `${this.contactsUrl}/${name}`;
    return this.http.get<Contact>(url);
  }

  // return contact as it has the ID after create.
  @RunOperation
  addContact(contact: Contact): Observable<Contact> {
    const url = `${this.contactsUrl}/`;
    return this.http.post(url, contact, httpOptions) as Observable<Contact>;
  }

  // does not return any.
  @RunOperation
  updateContact(contact: Contact): Observable<Contact> {
    const url = `${this.contactsUrl}/${contact.name}`;
    return this.http.put(url, contact, httpOptions) as Observable<Contact>;
  }

  @RunOperation
  deleteContact(contact: Contact | string): Observable<Contact> {
    const name = typeof contact === 'string' ? contact : contact.name;
    const url = `${this.contactsUrl}/${name}`;
    return this.http.delete<Contact>(url, httpOptions);
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
