import { Component } from "./component.js";
import { InputDialog, MediaData, TextData } from "./component/dialog/dialog.js";
import { MediaSectionInput } from "./component/dialog/input/media-input.js";
import { TextSectionInput } from "./component/dialog/input/text-input.js";
import { ImageComponent } from "./component/page/item/image.js";
import { NoteComponent } from "./component/page/item/note.js";
import { TodoComponent } from "./component/page/item/todo.js";
import { VideoComponent } from "./component/page/item/video.js";
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from "./component/page/page.js";

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
};
class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.bindElementToDialog<MediaSectionInput>(
      "#new-image",
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );

    this.bindElementToDialog<MediaSectionInput>(
      "#new-video",
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      "#new-note",
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      "#new-todo",
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );

    // test data
    this.page.addChild(
      new ImageComponent("Image Title", "https://picsum.photos/600/300")
    );

    this.page.addChild(
      new VideoComponent("Fubao", "https://youtu.be/FTAzs3TO1po")
    );
    this.page.addChild(new NoteComponent("Study Hard", "study hard"));
    this.page.addChild(new TodoComponent("todo", "get a job"));
  }
  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener("click", () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOncloeListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnsubmitListener(() => {
        const video = makeSection(input);
        this.page.addChild(video);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector(".document")! as HTMLElement, document.body);
