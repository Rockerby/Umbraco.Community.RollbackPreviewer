import { css } from "@umbraco-cms/backoffice/external/lit";
import { UmbRollbackModalElement } from "../umbraco/rollback/modal/rollback-modal.element";

export const rpRollbackStyles = [
  UmbRollbackModalElement.styles, // Importing the base styles from UmbRollbackModalElement
  css`
    .preview-view {
      #main {
        display: grid;
        place-content: start;
        grid-template-columns: 1fr;
        gap: var(--uui-size-space-5);
        container-type: inline-size;
        height: 100%;
      }

      #box-left {
        max-height: 300px;
        max-width: 100%;
      }

      #box-right {
        width: 100cqw;
      }
    }

    .rp-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--uui-size-space-5);
    }

    .rp-container {
      overflow: hidden;
    }
  `,
];
