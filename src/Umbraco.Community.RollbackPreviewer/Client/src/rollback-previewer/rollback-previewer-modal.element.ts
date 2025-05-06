import {
  customElement,
  html,
  nothing,
} from "@umbraco-cms/backoffice/external/lit";
import UmbRollbackModalElement from "../umbraco/rollback/modal/rollback-modal.element.js";
import { UMB_APP_CONTEXT } from "@umbraco-cms/backoffice/app";

import { rpRollbackStyles } from "./rollback-previewer-modal.styles.js";
import "./rollback-previewer-iframe.element.js";

@customElement("rp-rollback-modal")
export class RpRollbackModalElement extends UmbRollbackModalElement {
  #useJsonView: boolean = false;
  #serverUrl: string = "";

  constructor() {
    super();
    this.#init();
  }

  async #init() {
    const appContext = await this.getContext(UMB_APP_CONTEXT);
    this.#serverUrl = appContext.getServerUrl();
  }

  #switchView() {
    this.#useJsonView = !this.#useJsonView;
    this.requestUpdate();
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
            <rp-iframe src="${this.#serverUrl}/${this.currentDocument?.unique}?culture=${this._selectedCulture}">
            </rp-iframe>
          </div>
          <div class="rp-container selected">
            <div>
              <h4 class="uui-h4">Selected version</h4>
              <p class="uui-text">${this.currentVersionHeader}</p>
            </div>
            <rp-iframe
              src="${this.#serverUrl}?cid=${this.currentDocument
                ?.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
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

export default RpRollbackModalElement;

declare global {
  interface HTMLElementTagNameMap {
    "rp-rollback-modal": RpRollbackModalElement;
  }
}
