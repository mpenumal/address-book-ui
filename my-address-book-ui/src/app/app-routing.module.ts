import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactsSearchComponent } from './contacts-search/contacts-search.component';

const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  { path: 'contacts/search', component: ContactsSearchComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'contacts/:name', component: ContactDetailComponent },
  { path: 'contact', component: ContactDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
