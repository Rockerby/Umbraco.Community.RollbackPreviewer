import { css } from "@umbraco-cms/backoffice/external/lit";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

export const rpRollbackStyles = [
  UmbTextStyles,
  css`
    :host {
      color: var(--uui-color-text);
    }

    #language-box {
      margin-bottom: var(--uui-size-space-2);
    }

    #language-select {
      width: 100%;
    }

    .diff-added,
    ins {
      background-color: #00c43e63;
    }
    .diff-removed,
    del {
      background-color: #ff35356a;
    }
    .rollback-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--uui-size-space-5);
      cursor: pointer;
    }
    .rollback-item::after {
      content: "";
      position: absolute;
      inset: 2px;
      display: block;
      border: 2px solid transparent;
      pointer-events: none;
    }
    .rollback-item.active::after,
    .rollback-item:hover::after {
      border-color: var(--uui-color-selected);
    }
    .rollback-item:not(.active):hover::after {
      opacity: 0.5;
    }
    .rollback-item p {
      margin: 0;
      opacity: 0.5;
    }
    p.rollback-item-date {
      opacity: 1;
    }
    .rollback-item uui-button {
      white-space: nowrap;
    }

    #main {
      display: grid;
      grid-template-columns: 500px 1fr;
      gap: var(--uui-size-space-5);
      width: 100%;
      height: 100%;
    }
    .preview-view #main {
      flex-direction: column;
      grid-template-columns: 1fr;
    }
    .preview-view #box-left {
      height: 300px;
      max-width: 100%;
    }

    #versions-box {
      --uui-box-default-padding: 0;
    }

    #box-left {
      max-width: 500px;
      flex: 1;
      overflow: auto;
      height: 100%;
    }
    #box-right {
      flex: 1;
    }

    .rollback-preview-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--uui-size-space-5);
    }

    .version-preview {
      width: 48cqb;
    }

    .iframe-wrapper {
      transform-origin: 0 0;
      transform: scale(0.6); // TODO: This should scale dynamically
    }

    .iframe-container {
      width: var(--rp-iframe-width, 100%);
      height: var(--rp-iframe-height, 600px);
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
