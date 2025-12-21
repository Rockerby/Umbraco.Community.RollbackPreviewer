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
        /// This is used when EnableTimeLimitedSecrets is false.
        /// </summary>
        public string? FrontendPreviewAuthorisationSecret { get; set; } = null;

        /// <summary>
        /// Gets or sets a value indicating whether to use time-limited, dynamically generated secrets.
        /// When enabled, secrets are generated per request and expire after the configured duration.
        /// This provides better security than static secrets.
        /// </summary>
        public bool EnableTimeLimitedSecrets { get; set; } = false;

        /// <summary>
        /// Gets or sets the expiration time in minutes for time-limited secrets.
        /// Only used when EnableTimeLimitedSecrets is true.
        /// Default is 60 minutes.
        /// </summary>
        public int SecretExpirationMinutes { get; set; } = 60;
    }
}
