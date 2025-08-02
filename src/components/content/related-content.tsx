/**
 * Related Content Component
 */

import type { Category } from "@/lib/types";

interface RelatedContentProps {
  pageId: string | number;
  category?: Category;
}

export async function RelatedContent({ pageId, category }: RelatedContentProps) {
  // Related content API endpoint doesn't exist in the current Cognitor setup
  // Return null to hide the component until the API is available
  return null;
}