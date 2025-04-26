using System;
using System.Globalization;
using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Persistence.Repositories;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.OperationStatus;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Community.RollbackPreviewer.Extensions;
using Umbraco.Extensions;

namespace Umbraco.Community.RollbackPreviewer.Services
{
    public class RollbackContentFinder : IContentFinder
    {
        private readonly ILogger _logger;
        private readonly IContentService _contentService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        protected ICoreScopeProvider ScopeProvider { get; }
        private readonly IDocumentRepository _documentRepository;
        private readonly PublishedContentConverter _publishedContentConverter;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IContentVersionService _contentVersionService;
        private readonly IPublishedModelFactory _publishedModelFactory;


        /// <summary>
        ///     Initializes a new instance of the <see cref="ContentFinderByPageIdQuery" /> class.
        /// </summary>
        public RollbackContentFinder(
            ILogger<RollbackContentFinder> logger,
            IHttpContextAccessor httpContextAccessor, IContentService contentService,
            ICoreScopeProvider coreScopeProvider, IDocumentRepository documentRepository,
            IServiceScopeFactory scopeFactory, IContentVersionService contentVersionService,
        IPublishedModelFactory publishedModelFactory,
            PublishedContentConverter publishedContentConverter)
        {
            _contentService = contentService;
            _httpContextAccessor = httpContextAccessor;
            ScopeProvider = coreScopeProvider;
            _documentRepository = documentRepository;
            _publishedContentConverter = publishedContentConverter;
            _scopeFactory = scopeFactory;
            _logger = logger;
            _contentVersionService = contentVersionService;
            _publishedModelFactory = publishedModelFactory;
        }

        /// <inheritdoc />
        public async Task<bool> TryFindContent(IPublishedRequestBuilder frequest)
        {
            try
            {
                var req = _httpContextAccessor.HttpContext?.Request;

                // Make sure we have what we need
                if (req?.Query == null || !req.Query.ContainsKey("cid") || !req.Query.ContainsKey("vid"))
                {
                    return false;
                }
                bool skipVersion = false;
#if NET9_0_OR_GREATER

                if (!Guid.TryParse(req.Query["cid"], out Guid contentId) ||
                    !Guid.TryParse(req.Query["vid"], out Guid versionId))
                {
                    return false;
                }
#else
                if (!int.TryParse(req.Query["cid"], out int contentId) ||
                    !int.TryParse(req.Query["vid"], out int versionId))
                {
                    return false;
                }
                skipVersion = versionId < 0;
#endif

                // Make sure a back office user is logged in. Not concerned about content node permissions
                // just yet as we're not performing any write permissions.
                // This does mean that if a user hits this with the right queries they just see the published content
                if (!IsBackOfficeUserLoggedIn())
                {
                    return false;
                }

                // Get the current copy of the node
                IContent? content = _contentService.GetById(contentId);

                // Get the version
                IContent? version = await GetVersion(versionId);

                // Good old null checks
                if (content == null)
                {
                    _logger.LogWarning("Unable to find content with GUID {0} as content is NULL", contentId.ToString());
                    return false;
                }
                else if (!skipVersion && version == null)
                {
                    _logger.LogWarning("Unable to find content with GUID {0} as version (with ID {1}) is NULL", contentId.ToString(), versionId);
                    return false;
                }
                else if (content.Trashed) //TODO: Do we care if it's in the bin? How does rollback work if content is in the bin?
                {
                    _logger.LogWarning("Unable to find content with GUID {0} (and version {1}) as the content is trashed", contentId.ToString(), versionId);
                    return false;
                }
                else if (!skipVersion && version?.Id != content.Id)
                {
                    _logger.LogWarning("Requested version doesn't belong to the requested content. ContentID {0} / VersionID {1}", contentId, versionId);
                    return false;
                }

                if (!skipVersion)
                {
                    // Copy the changes from the version
                    content.CopyFrom(version, "*");
                }

                // Convert the IContent to IPublishedContent.
                IPublishedContent? pubContent = _publishedContentConverter.ToPublishedContent(content)?
                    .CreateModel(_publishedModelFactory);

                // Set the content that we "created" back to the pipeline
                frequest.SetPublishedContent(pubContent);

                // Return true to tell the system we have the content and not try anymore
                return true;
            }
            catch (Exception ex)
            {
                // We want something generic here as it could affect the entire site if the ContentFinder chain breaks!
                _logger.LogError(ex, "Error while loading content for RollbackPreviewer");
                return false;
            }

        }

        /// <summary>
        /// Checks to make sure a back office user is logged in.
        /// </summary>
        /// <returns></returns>
        private bool IsBackOfficeUserLoggedIn()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                // We can't use the inbuilt backoffice accessor service as we're in the front end so we need
                // to hook into the cookies to get the info that way. ContentFinders are singletons so we
                // need to scope in the depency
                // See: https://our.umbraco.com/forum/umbraco-9/106857-how-do-i-determine-if-a-backoffice-user-is-logged-in-from-a-razor-view
                var _snapshot = scope.ServiceProvider.GetRequiredService<IOptionsSnapshot<CookieAuthenticationOptions>>();
                CookieAuthenticationOptions cookieOptions = _snapshot.Get(Cms.Core.Constants.Security.BackOfficeAuthenticationType);

                string backOfficeCookie = _httpContextAccessor.HttpContext?.Request.Cookies[cookieOptions.Cookie.Name!];
                AuthenticationTicket unprotected = cookieOptions.TicketDataFormat.Unprotect(backOfficeCookie!);
                ClaimsIdentity backOfficeIdentity = unprotected?.Principal.GetUmbracoIdentity();

                return backOfficeIdentity != null;
            }
        }

        /// <summary>
        /// Fetch the IContent representation for the given versionId
        /// </summary>
        /// <param name="versionId"></param>
        /// <returns></returns>
        private async Task<IContent?> GetVersion(Guid versionId)
        {
            // The back office rollback viewer loads the versions in via GUID
            // - this is how the management API get the version from said GUID
#if NET9_0_OR_GREATER
            Attempt<IContent?, ContentVersionOperationStatus> attempt =
                await _contentVersionService.GetAsync(versionId);
            return attempt.Result;
#else
            throw new NotImplementedException();
#endif

        }
        private async Task<IContent?> GetVersion(int versionId)
        {
#if NET9_0_OR_GREATER
            throw new NotImplementedException();
#else
            var contentVersion = _contentService.GetVersion(versionId);
            return contentVersion;
#endif

        }
    }
}
