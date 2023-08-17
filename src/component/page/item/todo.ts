import { BaseComponent } from "../../../component.js";

export class TodoComponent extends BaseComponent<HTMLVideoElement> {
  constructor(title: string, todo: string) {
    super(`<section class="todo">
      <h2 class="todo_title"></h2>
      <input type="checkbox" class="todo-checkbox">
    </section>`);

    const titleElement = this.element.querySelector(
      ".todo_title"
    )! as HTMLHeadElement;

    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      ".todo-checkbox"
    )! as HTMLInputElement;

    bodyElement.insertAdjacentText("afterend", todo);
  }
}
