import { Routes, RouterModule }  from '@angular/router';

import { download } from './download.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  // {
  //   path: 'pdf/:courseId/emp/:empId/:lang',
  //   component: download
  // },
  // {
  //   path: 'pdf/:courseId/emp/:empId',
  //   component: download
  // },
  // {
  //   path: 'pdf/:lang',
  //   component: download
  // }
  {
    path: 'certificates/:linkId',
    component: download
  }
];
export const routing = RouterModule.forChild(routes);