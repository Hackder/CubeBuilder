import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './pages/editor/editor.component';
import { ViewportComponent } from './components/viewport/viewport.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ViewportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
