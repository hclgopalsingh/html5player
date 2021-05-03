import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NTitleComponent} from './modules/Global/ntitle/ntitle.component';
import { VideoComponent} from './modules/Global/video/video.component';
import { ContainerComponent} from './modules/Global/container/container.component';

export const APP_ROUTES: Routes = [ 
  {path: '', component: ContainerComponent, children: [
    { path: 'ntitle', component: NTitleComponent, runGuardsAndResolvers: 'always' },
    { path: 'ntitleext', component: NTitleComponent, runGuardsAndResolvers: 'always' },
    { path: 'video', component: VideoComponent, runGuardsAndResolvers: 'always' },
    { path: 'videoext', component: VideoComponent, runGuardsAndResolvers: 'always' },
  
    { path: 'EVA', loadChildren: () => import(`./modules/EVA/eva.module`).then(m => m.EvaModule) },  
    { path: 'ELE', loadChildren: () => import(`./modules/Elementary/elementary.module`).then(m => m.ElementaryModule) },  
    { path: 'BK', loadChildren: () => import(`./modules/Barahkhadi/barahkhadi.module`).then(m => m.BarahkhadiModule) },  
 
  ]}
 ];

 @NgModule({
	imports: [CommonModule, RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
