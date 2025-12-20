using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Core;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Community.RollbackPreviewer.Configuration;

namespace Umbraco.Community.RollbackPreviewer.Controllers
{
    /// <summary>
    /// API controller for accessing Rollback Previewer configuration settings
    /// </summary>
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "UmbracoCommunityRollbackPreviewer")]
    public class RollbackPreviewerConfigurationController : RollbackPreviewerConfigurationControllerBase
    {
        private readonly RollbackPreviewerOptions _options;

        public RollbackPreviewerConfigurationController(IOptions<RollbackPreviewerOptions> options)
        {
            _options = options.Value;
        }

        /// <summary>
        /// Get the frontend preview authorization configuration
        /// </summary>
        /// <returns>Configuration object with authorization settings</returns>
        [HttpGet("configuration")]
        [ProducesResponseType(typeof(RollbackPreviewerConfigurationResponse), StatusCodes.Status200OK)]
        public IActionResult GetConfiguration()
        {
            var response = new RollbackPreviewerConfigurationResponse
            {
                EnableFrontendPreviewAuthorisation = _options.EnableFrontendPreviewAuthorisation,
                FrontendPreviewAuthorisationSecret = _options.EnableFrontendPreviewAuthorisation
                    ? _options.FrontendPreviewAuthorisationSecret
                    : null
            };

            return Ok(response);
        }
    }

    /// <summary>
    /// Response model for Rollback Previewer configuration
    /// </summary>
    public class RollbackPreviewerConfigurationResponse
    {
        /// <summary>
        /// Indicates whether frontend preview authorization is enabled
        /// </summary>
        public bool EnableFrontendPreviewAuthorisation { get; set; }

        /// <summary>
        /// The secret token required for frontend preview access (only populated if authorization is enabled)
        /// </summary>
        public string? FrontendPreviewAuthorisationSecret { get; set; }
    }
}
