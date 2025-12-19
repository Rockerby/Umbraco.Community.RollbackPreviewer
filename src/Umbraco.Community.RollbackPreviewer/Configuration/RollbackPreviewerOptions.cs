namespace Umbraco.Community.RollbackPreviewer.Configuration
{
    public class RollbackPreviewerOptions
    {
        public const string SectionName = "RollbackPreviewer";
        /// <summary>
        /// Gets or sets a value indicating whether to enable authorization for the frontend previewer.
        /// </summary>
        public bool EnableFrontendPreviewAuthorisation { get; set; } = false;

        /// <summary>
        /// Gets or sets the secret string used for authorising frontend preview requests.
        /// </summary>
        public string? FrontendPreviewAuthorisationSecret { get; set; } = null;
    }
}
