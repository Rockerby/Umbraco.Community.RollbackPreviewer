import {
  css,
  customElement,
  html,
  LitElement,
  property,
  state,
  query
} from "@umbraco-cms/backoffice/external/lit";

export interface RollbackPreviewDevice {
  alias: string;
  label: string;
  demensions: {
    width: number;
    height: number;
  };
}

const device: RollbackPreviewDevice = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080,
  },
};

@customElement("rp-iframe")
export class RpIframe extends LitElement {
  @property({ type: String })
  public src = "";

  @state()
  _device: RollbackPreviewDevice = device;

  @query("iframe")
  iframe: HTMLIFrameElement | null | undefined;

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.src) {
      console.error("No src provided for rollback previewer iframe");
    }

    const resizeObserver = new ResizeObserver(() => {
      this.updateIframeDevice();
    });
    resizeObserver.observe(this);
  }

  updateIframeDevice() {
    let scale = this.clientWidth / this._device.demensions.width;

    if (scale > 1) {
      scale = 1;
    }

    this.style.setProperty("--rp-device-width", `${this._device.demensions.width}px`);
    this.style.setProperty("--rp-device-height", `${this._device.demensions.height}px`);
    this.style.setProperty("--rp-iframe-scale", `${scale}`);
    this.style.setProperty("--rp-height", `${this._device.demensions.height * scale}px`);
  }

  resetScrollPosition() {
    this.setScrollPosition(0, 0);
  }

  setScrollPosition(positionY: number = 0, positionX: number = 0) {
    this.iframe?.contentWindow?.scrollTo({
      top: positionY,
      left: positionX,
      behavior: 'instant'
    });
  }

  // This is a LitElement specific method that is called when the element is first rendered
  firstUpdated(): void {
    this.updateIframeDevice();
  }

  override render() {
    if (!this.src) {
      return null;
    }

    // TODO: Add configurable title attribute for the iframe
    return html`
      <div id="wrapper">
          <iframe src=${this.src}></iframe>
      </div>
    `;
  }

  static override styles = [
    css`
      :host {
        display: block;
        height: var(--rp-height, auto);
        width: 100cqw;
      }

      #wrapper {
        width: var(--rp-device-width, 100%);
        height: var(--rp-device-height, 600px);
        transform: scale(var(--rp-iframe-scale, 1));
        transform-origin: 0 0;
        overflow: hidden;
        position: relative;
      }

      iframe {
        border: none;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "rp-iframe": RpIframe;
  }
}

export { RpIframe as default };
