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

  async copyUrlToClipboard() {
    if (!this.src) return;

    const urlWithSecret = `${this.src}&secret=`;

    try {
      await navigator.clipboard.writeText(urlWithSecret);
      // Could add a toast notification here if desired
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
    }
  }

  // This is a LitElement specific method that is called when the element is first rendered
  firstUpdated(): void {
    this.updateIframeDevice();
  }

  override render() {
    if (!this.src) {
      return null;
    }

    return html`
      <div id="wrapper">
          <button
            id="copy-url-btn"
            @click=${this.copyUrlToClipboard}
            title="Copy shareable preview URL to clipboard"
            aria-label="Copy shareable preview URL to clipboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>
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

      #copy-url-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 1000;
        background-color: #6b7280;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s ease;
      }

      #copy-url-btn:hover {
        background-color: #4b5563;
      }

      #copy-url-btn:active {
        background-color: #374151;
      }

      #copy-url-btn svg {
        flex-shrink: 0;
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
