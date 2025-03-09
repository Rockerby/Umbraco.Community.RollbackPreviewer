using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Extensions;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.RollbackPreviewer.Extensions
{
    public class PublishedContentConverter(IContentTypeService ctBaseService, IPublishedContentTypeFactory pcTypeFactory)
    {
        public IPublishedContent ToPublishedContent(IContent content, bool isPreview = false)
        {
            return new ContentExtensions.PublishedContentWrapper(content, isPreview, ctBaseService, pcTypeFactory);
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

            public PublishedContentWrapper(IContent inner, bool isPreviewing,
                IContentTypeService ctBaseService, IPublishedContentTypeFactory pcTypeFactory)
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
                        return new PublishedPropertyWrapper(this, x, p, _isPreviewing);
                    })
                    .Cast<IPublishedProperty>()
                    .ToArray());

                _parent = new Lazy<IPublishedContent>(() =>
                {
                    //TODO: Get parent node
                    //return Current.Services.ContentService.GetById(_inner.ParentId)?.ToPublishedContent(_isPreviewing);
                    return null;
                });

                _children = new Lazy<IEnumerable<IPublishedContent>>(() =>
                {
                    //TODO: Get children nodes
                    //var c = Current.Services.ContentService.GetPagedChildren(_inner.Id, 0, 2000000000, out var totalRecords);
                    //return c.Select(x => x.ToPublishedContent(_isPreviewing)).OrderBy(x => x.SortOrder);
                    return null;
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

            public PublishedPropertyWrapper(IPublishedContent content, IPublishedPropertyType propertyType, IProperty property, bool isPreviewing)
                : this(propertyType, PropertyCacheLevel.Unknown) // cache level is ignored
            {
                _sourceValue = property?.GetValue();
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

            public object GetXPathValue(string culture = null, string segment = null)
            {
                var source = PropertyType.ConvertSourceToInter(_content, _sourceValue, _isPreviewing);

                return null;//TODO: XPathValue converter
                //PropertyType.ConvertInterToXPath(_content, PropertyCacheLevel.Unknown, source, _isPreviewing);
            }

            public object? GetDeliveryApiValue(bool expanding, string? culture = null, string? segment = null)
            {
                //TODO: Implement DeliveryApiValue
                throw new NotImplementedException();
            }
        }


        #endregion
    }
}
