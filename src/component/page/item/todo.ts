import { BaseComponent } from "../../../component.js";

export class TodoComponent extends BaseComponent<HTMLVideoElement> {
  constructor(title: string, todo: string) {
    super(`<section class="todo">
      <h2 class="page-item__title todo_title"></h2>
      <input type="checkbox" id="todo-checkbox">
      <label for="todo-checkbox" class="todo-label"></label>
    </section>`);

    const titleElement = this.element.querySelector(
      ".todo_title"
    )! as HTMLHeadElement;

    titleElement.textContent = title;

    const bodyElement = this.element.querySelector(
      "#todo-checkbox"
    )! as HTMLInputElement;

    bodyElement.insertAdjacentText("afterend", todo);
  }
}
