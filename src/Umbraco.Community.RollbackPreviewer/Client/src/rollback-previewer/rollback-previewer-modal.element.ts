// @ts-nocheck

import {
  customElement,
  html,
  nothing,
  query,
} from "@umbraco-cms/backoffice/external/lit";
import UmbRollbackModalElement from "../umbraco/rollback/modal/rollback-modal.element.js";
// import { UMB_BACKOFFICE_CONTEXT } from "@umbraco-cms/backoffice";

import { rpRollbackStyles } from "./rollback-previewer-modal.styles.js";
import "./rollback-previewer-iframe.element.js";
import RpIframe from "./rollback-previewer-iframe.element.js";

@customElement("rp-rollback-modal")
export class RpRollbackModalElement extends UmbRollbackModalElement {
  #useJsonView: boolean = false;
  #serverUrl: string = "";

  @query("#rollbackPreviewerLeft")
  rollbackPreviewerLeft: RpIframe | null | undefined;

  @query("#rollbackPreviewerRight")
  rollbackPreviewerRight: RpIframe | null | undefined;

  constructor() {
    super();
    this.#init();
  }

  async #init() {
    const appContext = await this.getContext('UmbBackofficeContext');
    this.#serverUrl = appContext.serverUrl;
  }

  async #switchView() {
    this.#useJsonView = !this.#useJsonView;
    this.requestUpdate();

    if (!this.#useJsonView) {
      await this.updateComplete;
      setTimeout(() => {
        this.#setupScrollSync();
    }, 300);
    }
  }

  #setupScrollSync() {
    if (!this.rollbackPreviewerLeft || !this.rollbackPreviewerRight) return;

    const iframes = [this.rollbackPreviewerLeft, this.rollbackPreviewerRight];

    iframes.forEach((iframe) => {
      if (iframe === null) return;

      iframe.onload = () => {
        iframe.resetScrollPosition();
      };
    });

    const handleScroll = (e: Event) => {
      const scrolledWindow = e.currentTarget as Window;
      const scrolledIframe = scrolledWindow?.frameElement as HTMLIFrameElement;
      const otherIframes = iframes.filter(
        (item) => item.iframe !== scrolledIframe
      ).map(item => item.iframe);

      if (!scrolledIframe) return;

      otherIframes.forEach((otherIframe) => {
        if (!otherIframe) return;
        otherIframe.contentWindow?.removeEventListener(
          "scroll",
          handleScroll
        );

        this.#syncScroll(scrolledIframe, otherIframe);

        window.requestAnimationFrame(() => {
          otherIframe?.contentWindow?.addEventListener(
            "scroll",
            handleScroll
          );
        });
      });
    };

    iframes.forEach((iframe) => {
      iframe.iframe?.contentWindow?.addEventListener("scroll", handleScroll);
    });
  }

  #syncScroll(
    scrolledIframe: HTMLIFrameElement,
    targetIframe: HTMLIFrameElement
  ) {
    if (!scrolledIframe || !targetIframe) return;

    try {
      const scrolledDoc =
        scrolledIframe.contentDocument ||
        scrolledIframe.contentWindow?.document;
      const targetDoc =
        targetIframe.contentDocument ||
        targetIframe.contentWindow?.document;

      if (!scrolledDoc || !targetDoc) return;

      // Calculate vertical scroll percentage
      const scrolledEle = scrolledDoc.documentElement || scrolledDoc.body;
      const targetEle = targetDoc.documentElement || targetDoc.body;

      const maxScrollTop = scrolledEle.scrollHeight - scrolledEle.clientHeight;
      const scrolledPercent =
        maxScrollTop > 0 ? scrolledEle.scrollTop / maxScrollTop : 0;

      const targetMaxScrollTop =
        targetEle.scrollHeight - targetEle.clientHeight;
      const targetTop = scrolledPercent * targetMaxScrollTop;

      // Calculate horizontal scroll percentage if needed
      const maxScrollLeft = scrolledEle.scrollWidth - scrolledEle.clientWidth;
      const scrolledWidthPercent =
        maxScrollLeft > 0 ? scrolledEle.scrollLeft / maxScrollLeft : 0;

      const targetMaxScrollLeft = targetEle.scrollWidth - targetEle.clientWidth;
      const targetLeft = scrolledWidthPercent * targetMaxScrollLeft;

      // Apply scroll to target iframe
      targetIframe.contentWindow?.scrollTo({
        top: targetTop,
        left: targetLeft,
        behavior: "instant",
      });
    } catch (e) {
      console.error("Error syncing scroll:", e);
    }
  }

  // This is a LitElement specific method that is called when the element is first rendered
  updated(): void {
    // This is a hack for now to wait for the iframe to load before setting up the scroll sync
    setTimeout(() => {
      this.#setupScrollSync();
    }, 300);
  }

  renderSelectedVersionVisualPreview() {
    if (!this._selectedVersion)
      return html`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;

    return html`
      <uui-box id="box-right">
        <div class="rp-wrapper">
          <div class="rp-container current">
            <div>
              <h4 class="uui-h4">Current version</h4>
            </div>
            <rp-iframe
              id="rollbackPreviewerLeft"
              src="${this.#serverUrl}/${this.currentDocument
                ?.unique}?culture=${this._selectedCulture}"
            >
            </rp-iframe>
          </div>
          <div class="rp-container selected">
            <div>
              <h4 class="uui-h4">Selected version</h4>
              <p class="uui-text">${this.currentVersionHeader}</p>
            </div>
            <rp-iframe
              id="rollbackPreviewerRight"
              src="${this.#serverUrl}/ucrbp?cid=${this.currentDocument
                ?.unique}&vid=${this._selectedVersion.id}&culture=${this
                ._selectedCulture}"
            ></rp-iframe>
          </div>
        </div>
      </uui-box>
    `;
  }

  override render() {
    return html`
      <umb-body-layout
        headline="Visual Rollback Preview"
        class=${this.#useJsonView ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${this.#switchView}
          style="margin-right:24px"
          label=${this.#useJsonView ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${this.#useJsonView
            ? "Visual difference"
            : "JSON difference"}</uui-button
        >

        <div id="main">
          <div id="box-left">
            ${this._availableVariants.length
              ? html`
                  <uui-box
                    id="language-box"
                    headline=${this.localize.term("general_language")}
                  >
                    ${this.renderCultureSelect()}
                  </uui-box>
                `
              : nothing}
            ${this.renderVersions()}
          </div>
          <div id="box-right">
            ${this.#useJsonView
              ? html` ${this.renderSelectedVersion()} `
              : html` ${this.renderSelectedVersionVisualPreview()} `}
          </div>
        </div>
        <umb-footer-layout slot="footer">
          <uui-button
            slot="actions"
            look="secondary"
            @click=${this.onCancel}
            label=${this.localize.term("general_cancel")}
          ></uui-button>
          <uui-button
            slot="actions"
            look="primary"
            @click=${this.onRollback}
            label=${this.localize.term("actions_rollback")}
            ?disabled=${!this._selectedVersion}
          ></uui-button>
        </umb-footer-layout>
      </umb-body-layout>
    `;
  }

  static override styles = rpRollbackStyles;
}
console.log("Ran the ele");
export default RpRollbackModalElement;

declare global {
  interface HTMLElementTagNameMap {
    "rp-rollback-modal": RpRollbackModalElement;
  }
}
