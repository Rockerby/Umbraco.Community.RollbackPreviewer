using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
#if NET9_0_OR_GREATER
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
#else
using Umbraco.Cms.Web.Common.Controllers;
#endif
using Umbraco.Cms.Core;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;
using Umbraco.Community.RollbackPreviewer.Configuration;
using Umbraco.Cms.Web.Common.Attributes;

namespace Umbraco.Community.RollbackPreviewer.Controllers
{
#if NET9_0_OR_GREATER
    [ApiController]
    [BackOfficeRoute("rollbackpreviewer/api/v{version:apiVersion}")]
    [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
    [MapToApi(Constants.ApiName)]
    public class RollbackPreviewerConfigurationControllerBase : ControllerBase
    {
    }
#endif

}
