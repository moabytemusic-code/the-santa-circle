/**
 * Amazon Affiliate URL Auto-Tagger
 * Automatically appends the SantaCircle Associate tag to Amazon product links.
 */

const DEFAULT_AMAZON_TAG = process.env.AMAZON_AFFILIATE_TAG || "thesantacircle-20";

/**
 * Checks if a URL belongs to Amazon (including shortened amzn.to links).
 */
export function isAmazonUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    return (
      host.includes("amazon.") ||
      host.endsWith("amzn.to") ||
      host.endsWith("amzn.com")
    );
  } catch {
    return false;
  }
}

/**
 * Appends or updates the affiliate associate tag on an Amazon URL.
 */
export function tagAmazonUrl(urlStr: string, customTag?: string): string {
  if (!urlStr || !urlStr.trim()) return urlStr;
  const tag = customTag || DEFAULT_AMAZON_TAG;

  try {
    const parsed = new URL(urlStr.trim());
    const host = parsed.hostname.toLowerCase();

    // Only modify Amazon domains (amzn.to redirects already contain their own tags or resolve via browser)
    if (host.includes("amazon.")) {
      parsed.searchParams.set("tag", tag);
      // Clean up common tracking noise
      parsed.searchParams.delete("ref_");
      parsed.searchParams.delete("keywords");
      return parsed.toString();
    }

    return urlStr.trim();
  } catch {
    // If invalid URL structure, return as-is
    return urlStr;
  }
}
