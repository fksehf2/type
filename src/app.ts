import { Component } from "./component.js";
import { ImageComponent } from "./component/page/item/image.js";
import { NoteComponent } from "./component/page/item/note.js";
import { TodoComponent } from "./component/page/item/todo.js";
import { VideoComponent } from "./component/page/item/video.js";
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from "./component/page/page.js";

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    const image = new ImageComponent(
      "Image Title",
      "https://picsum.photos/600/300"
    );
    this.page.addChild(image);
    // image.attachTo(appRoot, "beforeend");

    const video = new VideoComponent(
      "Video Title",
      "https://youtu.be/FTAzs3TO1po"
    );
    this.page.addChild(video);
    // video.attachTo(appRoot, "beforeend");

    const note = new NoteComponent("Note Title", "Note Body");
    this.page.addChild(note);
    // note.attachTo(appRoot, "beforeend");

    const todo = new TodoComponent("Todo Title", "Todo Item");
    this.page.addChild(todo);
    // todo.attachTo(appRoot, "beforeend");
  }
}

new App(document.querySelector(".document")! as HTMLElement);
