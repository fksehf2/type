import { BaseComponent, Component } from "../../component.js";

export interface Composable {
  addChild(child: Component): void;
}
type OnCloseListener = () => void;
type onDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;
type DragState = "start" | "stop" | "enter" | "leave";

interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOndragStateListener(listener: onDragStateListener<SectionContainer>): void;
  muteChildren(state: "mute" | "unmute"): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  private dragStateListener?: onDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li draggable="true" class="page-item">
            <section class="page-item_body">
              <div class="page-item-controls">
                <button class="close">&times;</button>
              </div>
            </section>
          </li>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
    this.element.addEventListener("dragstart", (event: DragEvent) => {
      this.onDragStart(event);
    });

    this.element.addEventListener("dragend", (event: DragEvent) => {
      this.onDragEnd(event);
    });

    this.element.addEventListener("dragenter", (event: DragEvent) => {
      this.onDragEnter(event);
    });

    this.element.addEventListener("dragleave", (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }
  onDragStart(_: DragEvent) {
    this.notifyDragObservers("start");
    this.element.classList.add("lifted");
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers("stop");
    this.element.classList.remove("lifted");
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers("enter");
    this.element.classList.add("drop-area");
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers("leave");
    this.element.classList.remove("drop-area");
  }
  onDropped() {
    this.element.classList.remove("drop-area");
  }
  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item_body"
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOndragStateListener(listener: onDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }
  muteChildren(state: "mute" | "unmute"): void {
    if (state == "mute") {
      this.element.classList.add("mute-children");
    } else {
      this.element.classList.remove("mute-children");
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;

  constructor(private pageItemMaker: SectionContainerConstructor) {
    super('<ul class="page"></ul>');

    this.element.addEventListener("dragover", (event: DragEvent) => {
      this.onDragOver(event);
    });

    this.element.addEventListener("drop", (event: DragEvent) => {
      this.onDrop(event);
    });
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log("onDragOver");
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    // console.log("onDrop");
    // 여기에서 위치를 바꿈
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? "beforebegin" : "afterend"
      );
    }
    this.dropTarget.onDropped();
  }
  addChild(section: Component) {
    // const item = new PageItemComponent();
    const item = new this.pageItemMaker();
    item.addChild(section);
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOndragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case "start":
            this.dragTarget = target;
            this.updateSections("mute");
            break;
          case "stop":
            this.dragTarget = undefined;
            this.updateSections("unmute");
            break;
          case "enter":
            this.dropTarget = target;
            console.log("enter", target);
            break;
          case "leave":
            console.log("leave", target);
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
  }

  private updateSections(state: "mute" | "unmute") {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
