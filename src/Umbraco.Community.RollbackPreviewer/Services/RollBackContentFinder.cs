using System;
using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Persistence.Repositories;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
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

        /// <summary>
        ///     Initializes a new instance of the <see cref="ContentFinderByPageIdQuery" /> class.
        /// </summary>
        public RollbackContentFinder(
            ILogger<RollbackContentFinder> logger,
            IHttpContextAccessor httpContextAccessor, IContentService contentService,
            ICoreScopeProvider coreScopeProvider, IDocumentRepository documentRepository,
            PublishedContentConverter publishedContentConverter)
        {
            _contentService = contentService;
            _httpContextAccessor = httpContextAccessor;
            ScopeProvider = coreScopeProvider;
            _documentRepository = documentRepository;
            _publishedContentConverter = publishedContentConverter;
            _logger = logger;
        }

        /// <inheritdoc />
        public Task<bool> TryFindContent(IPublishedRequestBuilder frequest)
        {
            try
            {
                //TODO: Check things exist beofre trying to parse...
                //TODO: Check that the user is logged in to the back office
                //TODO: Security: do we need to consider if the logged in user has access to this node?
                //      You wouldn't be able to get this unless you added in the query values

                // Check for the content params to load in the content node and the version
                Guid contentId = Guid.Parse(_httpContextAccessor.HttpContext.Request.Query["cid"]);
                int versionId = Int32.Parse(_httpContextAccessor.HttpContext.Request.Query["vid"]);

                // Get the current copy of the node
                IContent? content = _contentService.GetById(contentId);

                // Get the version
                IContent? version = GetVersion(versionId);

                //TODO: Do we need to make sure that the version belongs to the actual content?

                // Good old null checks
                if (content == null)
                {
                    _logger.LogWarning("Unable to find content with GUID {0} as content is NULL", contentId.ToString());
                    return Task.FromResult(false);
                }
                else if (version == null)
                {
                    _logger.LogWarning("Unable to find content with GUID {0} as version (with ID {1}) is NULL", contentId.ToString(), versionId);
                    return Task.FromResult(false);
                }
                else if (content.Trashed) //TODO: Do we care if it's in the bin? How does rollback work if content is in the bin?
                {
                    _logger.LogWarning("Unable to find content with GUID {0} (and version {1}) as the content is trashed", contentId.ToString(), versionId);
                    return Task.FromResult(false);
                }

                // Copy the changes from the version
                content.CopyFrom(version, "*");

                // Convert the IContent to IPublishedContent.
                IPublishedContent pubContent = _publishedContentConverter.ToPublishedContent(content);

                // Set the content that we "created" back to the pipeline
                frequest.SetPublishedContent(pubContent);

                // Return true to tell the system we have the content and not try anymore
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                //TODO: Very generic
                return Task.FromResult(false);
            }

        }

        /// <summary>
        /// Fetch the IContent representation for the given versionId
        /// </summary>
        /// <param name="versionId"></param>
        /// <returns></returns>
        private IContent? GetVersion(int versionId)
        {
            //TODO: Check this is correct! Seems a little overkill to be locking something here when
            // all we're doing is getting content (but might be the right way!)
            // The ContentVersionService only seems to give meta, not an IContent
            using (ICoreScope scope = ScopeProvider.CreateCoreScope(autoComplete: true))
            {
                scope.ReadLock(global::Umbraco.Cms.Core.Constants.Locks.ContentTree);
                return _documentRepository.GetVersion(versionId);
            }
        }
    }
}
