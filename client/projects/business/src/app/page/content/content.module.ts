import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentGridComponent } from './content-grid/content-grid.component';
import { ContentDetailComponent } from './content-detail/content-detail.component';
import { ContentRoutingModule } from './content-routing.module';

@NgModule({
  imports: [
    CommonModule, ContentRoutingModule
  ],
  declarations: [ContentGridComponent, ContentDetailComponent]
})
export class ContentModule { }
