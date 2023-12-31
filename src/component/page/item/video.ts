import { BaseComponent } from "../../../component.js";

export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="video">
  <div class="video_player">
    <iframe class="video_iframe"></iframe>
  </div>
  <h3 class="page-item__title video_title"></h3>
</section>`);

    const iframe = this.element.querySelector(
      ".video_iframe"
    )! as HTMLIFrameElement;

    iframe.src = this.convertToEmbededUrl(url); // ulr ->videoId
    console.log(url);

    const titleElement = this.element.querySelector(
      ".video_title"
    )! as HTMLHeadingElement;

    titleElement.textContent = title;
  }
  // input
  // https://www.youtube.com/watch?v=FTAzs3TO1po
  // https://youtu.be/FTAzs3TO1po
  // output
  // https://www.youtube.com/embed/FTAzs3TO1po
  // 정규표현식...! !

  private convertToEmbededUrl(url: string): string {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
    const match = url.match(regExp);

    const videoId = match ? match[1] || match[2] : undefined;
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
}
