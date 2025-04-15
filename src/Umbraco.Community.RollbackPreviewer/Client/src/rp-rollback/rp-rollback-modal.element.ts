import {
  customElement,
  html,
  nothing,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import { rpRollbackStyles } from "./rp-rollback-modal.styles.js";
import UmbRollbackModalElement from "../umbraco/rollback/modal/rollback-modal.element.js";

@customElement("rp-rollback-modal")
export class RpRollbackModalElement extends UmbRollbackModalElement {
  #useJsonView: boolean = false;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.style.setProperty("--rp-iframe-height", "1080px");
    this.style.setProperty("--rp-iframe-width", "1920px");
    this.style.setProperty("--rp-iframe-scale", "0.6");
  }

  #switchView() {
    this.#useJsonView = !this.#useJsonView;
    this.requestUpdate();
  }

  renderSelectedVersionVisualPreview() {
    // TODO: get the URL for the page to feed into the iframe

    if (!this._selectedVersion)
      return html`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;

    return html`
      <uui-box headline=${this.currentVersionHeader} id="box-right">
        <div>${unsafeHTML(this.localize.term("rollback_diffHelp"))}</div>
        <div class="rollback-preview-wrapper">
          <div class="version-preview">
            <h3>Current version</h3>
            <div class="iframe-wrapper">
              <div class="iframe-container">
                <iframe
                  src="https://localhost:44355/?cid=${this.currentDocument
                    ?.unique}"
                ></iframe>
              </div>
            </div>
          </div>
          <div class="version-preview">
            <h3>Selected version</h3>
            <div class="iframe-wrapper">
              <div class="iframe-container">
                <iframe
                  src="https://localhost:44355/?cid=${this.currentDocument
                    ?.unique}&vid=${this._selectedVersion.id}"
                ></iframe>
              </div>
            </div>
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

export default RpRollbackModalElement;

declare global {
  interface HTMLElementTagNameMap {
    "rp-rollback-modal": RpRollbackModalElement;
  }
}
