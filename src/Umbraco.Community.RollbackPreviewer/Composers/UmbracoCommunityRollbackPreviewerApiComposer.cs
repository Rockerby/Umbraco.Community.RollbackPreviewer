using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Api.Common.OpenApi;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Routing;
using Umbraco.Community.RollbackPreviewer.Extensions;
using Umbraco.Community.RollbackPreviewer.Services;

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

            // Set the options from configuration
            builder.Services.Configure<Configuration.RollbackPreviewerOptions>(builder.Config.GetSection(Configuration.RollbackPreviewerOptions.SectionName));

            // Configure Swagger/OpenAPI for the custom API
            //builder.Services.Configure<UmbSwaggerGenOptions>(options =>
            //{
            //    options.DocumentName = "UmbracoCommunityRollbackPreviewer";
            //    options.ApiName = "Umbraco Community Rollback Previewer API";
            //    options.ApiVersion = "Latest";
            //});
            builder.Services.AddSingleton<IOperationIdHandler, CustomOperationHandler>();

            builder.Services.Configure<SwaggerGenOptions>(opt =>
            {
                // Related documentation:
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/adding-a-custom-swagger-document
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/versioning-your-api
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/access-policies

                // Configure the Swagger generation options
                // Add in a new Swagger API document solely for our own package that can be browsed via Swagger UI
                // Along with having a generated swagger JSON file that we can use to auto generate a TypeScript client
                opt.SwaggerDoc(Constants.ApiName, new OpenApiInfo
                {
                    Title = "Rollback Previewer Backoffice API",
                    Version = "1.0",
                });

                // Enable Umbraco authentication for the "Example" Swagger document
                // PR: https://github.com/umbraco/Umbraco-CMS/pull/15699
                opt.OperationFilter<UmbracoCommunityRollbackPreviewerOperationSecurityFilter>();
            });
        }

        public class UmbracoCommunityRollbackPreviewerOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
        {
            protected override string ApiName => Constants.ApiName;
        }

        // This is used to generate nice operation IDs in our swagger json file
        // So that the gnerated TypeScript client has nice method names and not too verbose
        // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/umbraco-schema-and-operation-ids#operation-ids
        public class CustomOperationHandler : OperationIdHandler
        {
            public CustomOperationHandler(IOptions<ApiVersioningOptions> apiVersioningOptions) : base(apiVersioningOptions)
            {
            }

            protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor)
            {
                return controllerActionDescriptor.ControllerTypeInfo.Namespace?.StartsWith("UmbracoCommunityRollbackPreviewer.Controllers", comparisonType: StringComparison.InvariantCultureIgnoreCase) is true;
            }

            public override string Handle(ApiDescription apiDescription) => $"{apiDescription.ActionDescriptor.RouteValues["action"]}";
        }
    }
}
