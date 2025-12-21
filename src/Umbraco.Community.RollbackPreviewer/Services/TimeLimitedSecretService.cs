using System;
using System.Security.Cryptography;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Umbraco.Community.RollbackPreviewer.Configuration;

namespace Umbraco.Community.RollbackPreviewer.Services
{
    /// <summary>
    /// Service for generating and validating time-limited secrets for preview authorization
    /// </summary>
    public interface ITimeLimitedSecretService
    {
        /// <summary>
        /// Generates a new time-limited secret that expires after the configured duration
        /// </summary>
        /// <returns>A cryptographically secure random secret token</returns>
        string GenerateSecret();

        /// <summary>
        /// Validates whether a given secret is valid (exists and not expired)
        /// </summary>
        /// <param name="secret">The secret to validate</param>
        /// <returns>True if valid, false otherwise</returns>
        bool ValidateSecret(string secret);
    }

    public class TimeLimitedSecretService : ITimeLimitedSecretService
    {
        private readonly IMemoryCache _cache;
        private readonly RollbackPreviewerOptions _options;
        private const string CacheKeyPrefix = "RollbackPreviewSecret_";

        public TimeLimitedSecretService(IMemoryCache cache, IOptions<RollbackPreviewerOptions> options)
        {
            _cache = cache;
            _options = options.Value;
        }

        /// <inheritdoc />
        public string GenerateSecret()
        {
            // Generate a cryptographically secure random token
            var tokenBytes = new byte[32]; // 256 bits
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }

            // Convert to base64 URL-safe string
            var secret = Convert.ToBase64String(tokenBytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');

            // Store in cache with expiration
            var cacheKey = CacheKeyPrefix + secret;
            var expirationMinutes = _options.SecretExpirationMinutes;

            _cache.Set(cacheKey, true, TimeSpan.FromMinutes(expirationMinutes));

            return secret;
        }

        /// <inheritdoc />
        public bool ValidateSecret(string secret)
        {
            if (string.IsNullOrWhiteSpace(secret))
            {
                return false;
            }

            var cacheKey = CacheKeyPrefix + secret;
            return _cache.TryGetValue(cacheKey, out _);
        }
    }
}
