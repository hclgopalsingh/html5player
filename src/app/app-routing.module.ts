import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NTitleComponent} from './modules/Global/ntitle/ntitle.component';
import { VideoComponent} from './modules/Global/video/video.component';
import { ContainerComponent} from './modules/Global/container/container.component';
// import { TemplateTenComponent } from './modules/EVA/template10/template10.component';
// import { TemplateFourteenComponent } from './modules/EVA/template14/template14.component';

const routes: Routes = [
  { path: 'shikshaplayer/playerone', component: View1Component },
  { path: 'shikshaplayer/playertwo', component: View2Component },
  { path: 'shikshaplayer', redirectTo: 'shikshaplayer/playerone' }
 ];

// export const APP_ROUTES: Routes = [ 
//   {path: '', component: ContainerComponent, children: [
//     { path: 'ntitle', component: NTitleComponent, runGuardsAndResolvers: 'always' },
//     { path: 'ntitleext', component: NTitleComponent, runGuardsAndResolvers: 'always' },
//     { path: 'video', component: VideoComponent, runGuardsAndResolvers: 'always' },
//     { path: 'videoext', component: VideoComponent, runGuardsAndResolvers: 'always' },
  
//     { path: 'EVA', loadChildren: () => import(`./modules/EVA/eva.module`).then(m => m.EvaModule) },  
//   ]}
//  ];

export const APP_ROUTES: Routes = [ 
  {path: '', component: ContainerComponent, children: [
    { path: 'ntitle', component: NTitleComponent, runGuardsAndResolvers: 'always' },
    { path: 'ntitleext', component: NTitleComponent, runGuardsAndResolvers: 'always' },
    { path: 'video', component: VideoComponent, runGuardsAndResolvers: 'always' },
    { path: 'videoext', component: VideoComponent, runGuardsAndResolvers: 'always' },
    { path: 'EVA', loadChildren: () => import(`./modules/EVA/eva.module`).then(m => m.EvaModule) },  
  ]},
  { path: 'htmlPlayer', redirectTo: '' },
  
  { path: 'shikshaplayer/playerone', component: View1Component },
  { path: 'shikshaplayer/playertwo', component: View2Component },
  { path: 'shikshaplayer', redirectTo: 'shikshaplayer/playerone' }
 ];

 @NgModule({
	imports: [CommonModule, RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
