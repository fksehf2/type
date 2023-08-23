import { Component } from "./component.js";
import { InputDialog } from "./component/dialog/dialog.js";
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

type InputComponentConstructor<T = MediaSectionInput | TextSectionInput> = {
  new (): T;
};
class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    // const image = new ImageComponent(
    //   "Image Title",
    //   "https://picsum.photos/600/300"
    // );
    // this.page.addChild(image);
    // // image.attachTo(appRoot, "beforeend");

    // const video = new VideoComponent(
    //   "Video Title",
    //   "https://youtu.be/FTAzs3TO1po"
    // );
    // this.page.addChild(video);
    // // video.attachTo(appRoot, "beforeend");

    // const note = new NoteComponent("Note Title", "Note Body");
    // this.page.addChild(note);
    // // note.attachTo(appRoot, "beforeend");

    // const todo = new TodoComponent("Todo Title", "Todo Item");
    // this.page.addChild(todo);
    // // todo.attachTo(appRoot, "beforeend");
    this.bindElementToDialog<MediaSectionInput>(
      "#new-image",
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );
    // const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
    // imageBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const mediaSection = new MediaSectionInput();
    //   dialog.addChild(mediaSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOncloeListener(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnsubmitListener(() => {
    //     const image = new ImageComponent(mediaSection.title, mediaSection.url);
    //     this.page.addChild(image);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });
    this.bindElementToDialog<MediaSectionInput>(
      "#new-video",
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );
    // const videoBtn = document.querySelector("#new-video")! as HTMLButtonElement;
    // videoBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const mediaSection = new MediaSectionInput();
    //   dialog.addChild(mediaSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOncloeListener(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnsubmitListener(() => {
    //     const video = new VideoComponent(mediaSection.title, mediaSection.url);
    //     this.page.addChild(video);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });
    this.bindElementToDialog<TextSectionInput>(
      "#new-note",
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );
    // const noteBtn = document.querySelector("#new-note")! as HTMLButtonElement;
    // noteBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const mediaSection = new TextSectionInput();
    //   dialog.addChild(mediaSection);
    //   dialog.attachTo(dialogRoot);

    //   dialog.setOncloeListener(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnsubmitListener(() => {
    //     const note = new NoteComponent(mediaSection.title, mediaSection.body);
    //     this.page.addChild(note);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });
    this.bindElementToDialog<TextSectionInput>(
      "#new-todo",
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );
    const todoBtn = document.querySelector("#new-todo")! as HTMLButtonElement;
    todoBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const mediaSection = new TextSectionInput();
      dialog.addChild(mediaSection);
      dialog.attachTo(dialogRoot);

      dialog.setOncloeListener(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnsubmitListener(() => {
        const todo = new TodoComponent(mediaSection.title, mediaSection.body);
        this.page.addChild(todo);
        dialog.removeFrom(dialogRoot);
      });
    });
  }

  private bindElementToDialog<T extends MediaSectionInput | TextSectionInput>(
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
