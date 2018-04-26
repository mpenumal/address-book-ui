import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactsSearchComponent } from './contacts-search/contacts-search.component';

// routes should have a flow
const routes: Routes = [
  { path: '', redirectTo: '/contacts/list', pathMatch: 'full' },
  { path: 'contacts/search', component: ContactsSearchComponent },
  { path: 'contacts/list', component: ContactListComponent },
  { path: 'contacts/:name', component: ContactDetailComponent },
  { path: 'contacts/new', component: ContactDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
