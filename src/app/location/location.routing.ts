import { Routes, RouterModule } from '@angular/router';
import { LocationComponent } from './location.component';
import { ModuleWithProviders } from '@angular/core';
import { AddLocationComponent } from './add-location/add-location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';

export const routes: Routes = [
      { path: '', component: LocationComponent },
      { path: 'add', component: AddLocationComponent },
      { path: 'edit/:id', component: EditLocationComponent }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
