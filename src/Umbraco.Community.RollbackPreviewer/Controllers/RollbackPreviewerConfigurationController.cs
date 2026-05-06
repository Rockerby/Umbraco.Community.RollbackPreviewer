using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Community.RollbackPreviewer.Configuration;
using Umbraco.Community.RollbackPreviewer.Services;

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
        private readonly ITimeLimitedSecretService _secretService;
        private readonly IContentService _contentService;
        private readonly IContentVersionService _contentVersionService;

        public RollbackPreviewerConfigurationController(
            IOptions<RollbackPreviewerOptions> options,
            ITimeLimitedSecretService secretService,
            IContentService contentService,
            IContentVersionService contentVersionService)
        {
            _options = options.Value;
            _secretService = secretService;
            _contentService = contentService;
            _contentVersionService = contentVersionService;
        }

        /// <summary>
        /// Get the frontend preview authorization configuration.
        /// If time-limited secrets are enabled, a new secret is generated with each request.
        /// </summary>
        /// <returns>Configuration object with authorization settings</returns>
        [HttpGet("configuration")]
        [ProducesResponseType(typeof(RollbackPreviewerConfigurationResponse), StatusCodes.Status200OK)]
        public IActionResult GetConfiguration()
        {
            string? secret = null;

            if (_options.EnableFrontendPreviewAuthorisation)
            {
                if (_options.EnableTimeLimitedSecrets)
                {
                    // Generate a new time-limited secret for this request
                    secret = _secretService.GenerateSecret();
                }
                else
                {
                    // Use the static configured secret
                    secret = _options.FrontendPreviewAuthorisationSecret;
                }
            }

            var response = new RollbackPreviewerConfigurationResponse
            {
                EnableFrontendPreviewAuthorisation = _options.EnableFrontendPreviewAuthorisation,
                FrontendPreviewAuthorisationSecret = secret,
                IsTimeLimited = _options.EnableTimeLimitedSecrets,
                ExpirationMinutes = _options.EnableTimeLimitedSecrets ? _options.SecretExpirationMinutes : null
            };

            return Ok(response);
        }

#if NET9_0_OR_GREATER
        [HttpGet("previewurl")]
        [ProducesResponseType(typeof(RollbackPreviewerUrlResponse), StatusCodes.Status200OK)]
#else
        [Route("umbraco/backoffice/RollbackPreviewerConfiguration/GetPreviewUrl")]
#endif
        public IActionResult GetPreviewUrl(int contentId)
        {
            if (_options.EnableFrontendPreviewAuthorisation)
            {
                // Because we're loading in the latest content but "preview"
                // we can just use the latest version ID.
                var content = _contentService.GetById(contentId);
                int? versionId = content?.VersionId;

                if (versionId == null)
                {
                    return BadRequest("Content not found");
                }

                // Add the new query param of "preview=true" which loads the latest preview version in
                string url = "/ucrbp?cid=" + contentId + "&vid=" + versionId + "&preview=true";
                return Ok(new RollbackPreviewerUrlResponse()
                {
                    Url = url
                });
            }

            return BadRequest("Front end preview not enabled");
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
        /// The secret token required for frontend preview access.
        /// If time-limited secrets are enabled, this is a newly generated token valid for the configured duration.
        /// Otherwise, this is the static configured secret.
        /// Only populated if authorization is enabled.
        /// </summary>
        public string? FrontendPreviewAuthorisationSecret { get; set; }

        /// <summary>
        /// Indicates whether the secret is time-limited (expires after a set duration)
        /// </summary>
        public bool IsTimeLimited { get; set; }

        /// <summary>
        /// The expiration time in minutes for time-limited secrets (null if not using time-limited secrets)
        /// </summary>
        public int? ExpirationMinutes { get; set; }
    }

    /// <summary>
    /// Response model for Rollback Previewer URL Preview
    /// </summary>
    public class RollbackPreviewerUrlResponse
    {
        /// <summary>
        /// The preview URL (without domain)
        /// </summary>
        public string Url { get; set; }

    }
}
