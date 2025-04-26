using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Routing;
using Umbraco.Community.RollbackPreviewer.Services;
using Umbraco.Community.RollbackPreviewer.Extensions;

namespace Umbraco.Community.RollbackPreviewer.Composers
{
    public class UmbracoCommunityRollbackPreviewerApiComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
#if NET9_0_OR_GREATER
            builder.ContentFinders().InsertBefore<ContentFinderByUrlNew, RollbackContentFinder>();
#else
            builder.ContentFinders().InsertBefore<ContentFinderByUrl, RollbackContentFinder>();
#endif
            builder.Services.AddTransient<PublishedContentConverter>();
        }
    }
}
