using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Extensions;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core;

namespace Umbraco.Community.RollbackPreviewer.Extensions
{
    public class PublishedContentConverter(IContentTypeService ctBaseService, IPublishedContentTypeFactory pcTypeFactory,
        IContentService contentService, IPublishedModelFactory publishedModelFactory)
    {
        public IPublishedContent ToPublishedContent(IContent content, string? culture, bool isPreview = false)
        {
            return new ContentExtensions.PublishedContentWrapper(content, culture, isPreview, ctBaseService, pcTypeFactory, contentService, publishedModelFactory, this);
        }
    }

    public static class ContentExtensions
    {
        #region PublishedContentWrapper

        public class PublishedContentWrapper : IPublishedContent
        {
            private static readonly IReadOnlyDictionary<string, PublishedCultureInfo> NoCultureInfos = new Dictionary<string, PublishedCultureInfo>();

            private readonly IContent _inner;
            private readonly bool _isPreviewing;

            private readonly Lazy<string> _creatorName;
            private readonly Lazy<string> _writerName;
            private readonly Lazy<IPublishedContentType> _contentType;
            private readonly Lazy<IPublishedProperty[]> _properties;
            private readonly Lazy<IPublishedContent> _parent;
            private readonly Lazy<IEnumerable<IPublishedContent>> _children;
            private readonly Lazy<IReadOnlyDictionary<string, PublishedCultureInfo>> _cultureInfos;

            public PublishedContentWrapper(IContent inner, string? culture, bool isPreviewing,
                IContentTypeService ctBaseService, IPublishedContentTypeFactory pcTypeFactory,
                IContentService contentService, IPublishedModelFactory publishedModelFactory, PublishedContentConverter converter)
            {
                _inner = inner ?? throw new NullReferenceException("inner");
                _isPreviewing = isPreviewing;

                //TODO: Get author information
                _creatorName = new Lazy<string>(() => "");// _inner.GetCreatorProfile()?.Name);
                _writerName = new Lazy<string>(() => "");// _inner.GetWriterProfile()?.Name);

                _contentType = new Lazy<IPublishedContentType>(() =>
                {
                    var ct = ctBaseService.Get(_inner.ContentType.Id);
                    return pcTypeFactory.CreateContentType(ct);
                });

                _properties = new Lazy<IPublishedProperty[]>(() => ContentType.PropertyTypes
                    .Select(x =>
                    {
                        var p = _inner.Properties.SingleOrDefault(xx => xx.Alias == x.Alias);
                        return new PublishedPropertyWrapper(this, x, p, culture, _isPreviewing);
                    })
                    .Cast<IPublishedProperty>()
                    .ToArray());

                _parent = new Lazy<IPublishedContent>(() =>
                {
                    var p = contentService.GetById(_inner.ParentId);
                    if (p == null)
                        return null;
                    return converter.ToPublishedContent(p, culture).CreateModel(publishedModelFactory);
                });

                _children = new Lazy<IEnumerable<IPublishedContent>>(() =>
                {
                    var c = contentService.GetPagedChildren(_inner.Id, 0, 2000000000, out var totalRecords);
                    return c.Select(x => converter.ToPublishedContent(x, culture).CreateModel(publishedModelFactory)).OrderBy(x => x.SortOrder);
                });

                _cultureInfos = new Lazy<IReadOnlyDictionary<string, PublishedCultureInfo>>(() =>
                {
                    if (!_inner.ContentType.VariesByCulture())
                        return NoCultureInfos;

                    return _inner.PublishCultureInfos.Values
                        .ToDictionary(x => x.Culture, x => new PublishedCultureInfo(x.Culture,
                            x.Name,
                            GetUrlSegment(x.Culture),
                            x.Date));
                });
            }

            public IPublishedContentType ContentType
                => _contentType.Value;

            public int Id
                => _inner.Id;

            public Guid Key
                => _inner.Key;

            public int? TemplateId
                => _inner.TemplateId;

            public int SortOrder
                => _inner.SortOrder;

            public string Name
                => _inner.Name;

            public IReadOnlyDictionary<string, PublishedCultureInfo> Cultures
                => _cultureInfos.Value;

            public string UrlSegment
                => GetUrlSegment();

            public string WriterName
                => _writerName.Value;

            public string CreatorName
                => _creatorName.Value;

            public int WriterId
                => _inner.WriterId;

            public int CreatorId
                => _inner.CreatorId;

            public string Path
                => _inner.Path;

            public DateTime CreateDate
                => _inner.CreateDate;

            public DateTime UpdateDate
                => _inner.UpdateDate;

            public int Level
                => _inner.Level;

            public string Url
                => null; // TODO: Implement?

            public PublishedItemType ItemType
                => PublishedItemType.Content;

            public bool IsDraft(string culture = null)
                => !IsPublished(culture);

            public bool IsPublished(string culture = null)
                => _inner.IsCulturePublished(culture);

            public IPublishedContent Parent
                => _parent.Value;

            public IEnumerable<IPublishedContent> Children
                => _children.Value; // TODO: Filter by current culture?

            public IEnumerable<IPublishedContent> ChildrenForAllCultures
                => _children.Value;

            public IEnumerable<IPublishedProperty> Properties
                => _properties.Value;

            public IPublishedProperty GetProperty(string alias)
                => _properties.Value.FirstOrDefault(x => x.Alias.InvariantEquals(alias));

            private string GetUrlSegment(string culture = null)
            {
                //TODO: Calculate Url Segment
                //var urlSegmentProviders = Current.UrlSegmentProviders;
                //var url = urlSegmentProviders.Select(p => p.GetUrlSegment(_inner, culture)).FirstOrDefault(u => u != null);
                //url = url ?? new DefaultUrlSegmentProvider().GetUrlSegment(_inner, culture); // be safe
                //return url;
                return "";
            }
        }

        public class PublishedPropertyWrapper : IPublishedProperty
        {
            private readonly object _sourceValue;
            private readonly IPublishedContent _content;
            private readonly bool _isPreviewing;

            public PublishedPropertyWrapper(IPublishedContent content,  IPublishedPropertyType propertyType, IProperty property, string? culture, bool isPreviewing)
                : this(propertyType, PropertyCacheLevel.Unknown) // cache level is ignored
            {
                _sourceValue = property?.GetValue(culture);

                if (_sourceValue == null)
                {
                    // Block properties return null for GetValue...
                    _sourceValue = property?.Values?.FirstOrDefault()?.EditedValue;
                }

                _content = content;
                _isPreviewing = isPreviewing;
            }

            protected PublishedPropertyWrapper(IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel)
            {
                PropertyType = propertyType ?? throw new ArgumentNullException(nameof(propertyType));
                ReferenceCacheLevel = referenceCacheLevel;
            }

            public IPublishedPropertyType PropertyType { get; }
            public PropertyCacheLevel ReferenceCacheLevel { get; }
            public string Alias => PropertyType.Alias;

            public bool HasValue(string culture = null, string segment = null)
            {
                return _sourceValue != null && ((_sourceValue is string) == false || string.IsNullOrWhiteSpace((string)_sourceValue) == false);
            }

            public object GetSourceValue(string culture = null, string segment = null)
            {
                return _sourceValue;
            }

            public object GetValue(string culture = null, string segment = null)
            {
                var source = PropertyType.ConvertSourceToInter(_content, _sourceValue, _isPreviewing);

                return PropertyType.ConvertInterToObject(_content, PropertyCacheLevel.Unknown, source, _isPreviewing);
            }

            public object? GetDeliveryApiValue(bool expanding, string? culture = null, string? segment = null)
            {
                //TODO: Implement DeliveryApiValue
                throw new NotImplementedException();
            }

            /// <summary>
            /// Version 13 specific
            /// </summary>
            /// <param name="culture"></param>
            /// <param name="segment"></param>
            /// <returns></returns>
            /// <exception cref="NotImplementedException"></exception>
            public object? GetXPathValue(string? culture = null, string? segment = null)
            {
                //TODO: Implement DeliveryApiValue
                throw new NotImplementedException();
            }
        }


        #endregion
    }
}
