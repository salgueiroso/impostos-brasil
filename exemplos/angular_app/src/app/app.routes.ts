import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'exemplo',
        loadComponent: () => import('./exemplo/exemplo.component').then(m => m.ExemploComponent)
    }
];
