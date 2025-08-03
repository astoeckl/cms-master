/**
 * Rich Content Renderer - Renders dynamic CMS content blocks
 */

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Quote, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RichContent, PageElement, ContentElement } from "@/lib/types";
import { ContentReferenceList, ContentReferenceGrid, ContentReferenceTeaser } from "./content-references";

interface RichContentRendererProps {
  content?: RichContent[];
  pageElements?: PageElement[];
}

export function RichContentRenderer({ content, pageElements }: RichContentRendererProps) {
  // Prioritize pageElements (new format) over legacy content
  if (pageElements && Array.isArray(pageElements) && pageElements.length > 0) {
    // Group elements by section
    const mainElements = pageElements
      .filter(element => !element.section || element.section === 'main')
      .sort((a, b) => a.position - b.position);
    
    const sidebarElements = pageElements
      .filter(element => element.section === 'sidebar')
      .sort((a, b) => a.position - b.position);

    // Check if we have sidebar elements
    const hasSidebar = sidebarElements.length > 0;

    if (hasSidebar) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Takes 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
              {mainElements.map((element) => (
                <PageElementRenderer key={element.id} element={element} />
              ))}
            </div>
          </div>

          {/* Sidebar - Takes 1/3 on large screens */}
          <div className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-4">
              {sidebarElements.map((element) => (
                <PageElementRenderer key={element.id} element={element} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // No sidebar - full width layout
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="space-y-6">
          {mainElements.map((element) => (
            <PageElementRenderer key={element.id} element={element} />
          ))}
        </div>
      </div>
    );
  }

  // Fallback to legacy content format
  if (content && Array.isArray(content) && content.length > 0) {
    return (
      <div className="space-y-6">
        {content.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </div>
    );
  }

  return null;
}

/**
 * Page Element Renderer - Handles Cognitor content elements
 */
interface PageElementRendererProps {
  element: PageElement;
}

function PageElementRenderer({ element }: PageElementRendererProps) {
  const { content_element } = element;
  const { type_identifier, data } = content_element;

  // Safety wrapper to prevent object rendering errors
  const SafeRenderer = ({ children }: { children: React.ReactNode }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error('Render error in PageElementRenderer:', error);
      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-800 text-sm">
              <div className="font-medium">Render Error</div>
              <div className="text-xs mt-1">Content Type: {type_identifier}</div>
              <details className="mt-2">
                <summary className="cursor-pointer">Debug Info</summary>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  const renderContent = () => {
    switch (type_identifier) {
      case 'textmitbilddemo':
        return (
          <div className="space-y-8">
            {/* Title */}
            {data.title && (
              <h2 className="text-3xl font-bold text-foreground leading-tight">
                {data.title}
              </h2>
            )}
            
            {/* Image */}
            {data.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src={data.image}
                  alt={data.title || 'Content image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            )}
            
            {/* Content */}
            {data.content && (
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {data.content}
                </p>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {data.title && <h2>{data.title}</h2>}
            {data.content && <p>{data.content}</p>}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {data.title && (
              <h3 className="text-xl font-semibold">{data.title}</h3>
            )}
            {data.url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <Image
                  src={data.url}
                  alt={data.alt || data.title || 'Image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            )}
            {data.caption && (
              <p className="text-sm text-muted-foreground text-center">
                {data.caption}
              </p>
            )}
          </div>
        );

      case 'hero':
      case 'hero_section':
        return (
          <div className="relative bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 lg:p-12">
            <div className="space-y-6">
              {data.title && (
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  {data.title}
                </h1>
              )}
              {data.subtitle && (
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl">
                  {data.subtitle}
                </p>
              )}
              {data.content && (
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {data.content}
                  </p>
                </div>
              )}
              {data.background_image && (
                <div className="absolute inset-0 rounded-xl overflow-hidden opacity-10">
                  <Image
                    src={data.background_image}
                    alt={data.title || 'Hero background'}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'card':
      case 'content_card':
        return (
          <Card className="overflow-hidden">
            {data.image && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={data.image}
                  alt={data.title || 'Card image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.title && (
                  <h3 className="text-xl font-semibold">{data.title}</h3>
                )}
                {data.content && (
                  <p className="text-muted-foreground">{data.content}</p>
                )}
                {data.button_text && data.button_url && (
                  <Link href={data.button_url}>
                    <Button variant="outline" className="w-full">
                      {data.button_text}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
        </Card>
      );

      case 'gallery':
        const images = data.images || [];
        return (
          <div className="space-y-4">
            {data.title && (
              <h3 className="text-xl font-semibold">{data.title}</h3>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image: any, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={typeof image === 'string' ? image : image.url}
                    alt={typeof image === 'object' ? image.alt || `Gallery image ${index + 1}` : `Gallery image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'news_list':
      case 'articles_list':
      case 'posts_list':
        return <ContentReferenceList data={data} contentType={type_identifier} />;

      case 'news_grid':
      case 'articles_grid':
      case 'posts_grid':
        return <ContentReferenceGrid data={data} contentType={type_identifier} />;

      case 'news_teaser':
      case 'latest_news':
      case 'featured_articles':
        return <ContentReferenceTeaser data={data} contentType={type_identifier} />;

      case 'content_list':
      case 'reference_list':
        // Generic content list handler
        return <ContentReferenceList data={data} contentType={type_identifier} />;

      case 'content_grid':
      case 'reference_grid':
        // Generic content grid handler
        return <ContentReferenceGrid data={data} contentType={type_identifier} />;

      case 'feature':
      case 'feature_highlight':
      case 'feature_item':
        return (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.title && (
                <h3 className="text-lg font-semibold">{data.title}</h3>
              )}
              {data.short_description && (
                <p className="text-muted-foreground">{data.short_description}</p>
              )}
              {data.content && typeof data.content === 'string' && (
                <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                  <p>{data.content}</p>
                </div>
              )}
              {data.keywords && (
                <div className="flex flex-wrap gap-2">
                  {(typeof data.keywords === 'string' 
                    ? data.keywords.split(',').map(k => k.trim())
                    : Array.isArray(data.keywords) 
                    ? data.keywords 
                    : []
                  ).map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        );

      case 'sidebar_widget':
      case 'widget':
        return (
          <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              {data.title && (
                <h4 className="font-semibold text-sm">{data.title}</h4>
              )}
              {data.content && (
                <div className="text-sm text-muted-foreground">
                  {typeof data.content === 'string' ? (
                    <p>{data.content}</p>
                  ) : (
                    <pre className="text-xs bg-background p-2 rounded">
                      {JSON.stringify(data.content, null, 2)}
                    </pre>
                  )}
                </div>
              )}
              {data.short_description && data.short_description !== data.content && (
                <p className="text-xs text-muted-foreground">{data.short_description}</p>
              )}
            </div>
          </CardContent>
        </Card>
        );

      default:
        // Generic renderer for unknown content types with smart image detection
        return (
          <div className="space-y-6">
          {/* Title */}
          {data.title && (
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {data.title}
            </h2>
          )}
          
          {/* Content */}
          {data.content && (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="text-muted-foreground leading-relaxed">
                {typeof data.content === 'string' ? (
                  <p>{data.content}</p>
                ) : typeof data.content === 'object' ? (
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(data.content, null, 2)}
                  </pre>
                ) : (
                  <p>{String(data.content)}</p>
                )}
              </div>
            </div>
          )}

          {/* Smart field rendering */}
          <div className="space-y-4">
            {Object.entries(data)
              .filter(([key]) => !['title', 'content'].includes(key))
              .map(([key, value]) => (
                <GenericFieldRenderer 
                  key={key} 
                  fieldName={key} 
                  value={value} 
                  contentType={type_identifier}
                />
              ))}
          </div>

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium mb-2">Debug Info (dev only):</div>
                  <div>Content Type: <code className="bg-muted px-1 rounded">{type_identifier}</code></div>
                  <div>Fields: <code className="bg-muted px-1 rounded">{Object.keys(data).join(', ')}</code></div>
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">Raw Data</summary>
                    <pre className="mt-2 text-xs bg-background p-2 rounded overflow-x-auto max-h-40">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </details>
                  {Object.keys(data).some(key => 
                    key.includes('id') || key.includes('ref') || 
                    key.includes('news') || key.includes('article') || 
                    Array.isArray(data[key])
                  ) && (
                    <div className="mt-2 text-orange-600">
                      ⚠️ Potential references detected - check Console for resolution logs
                    </div>
                  )}
                  {Object.keys(data).some(key => 
                    typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])
                  ) && (
                    <div className="mt-2 text-yellow-600">
                      🔧 Object values detected - using safe rendering
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        );
    }
  };

  return <SafeRenderer>{renderContent()}</SafeRenderer>;
}

/**
 * Individual Content Block Renderer (Legacy)
 */
interface ContentBlockProps {
  block: RichContent;
}

function ContentBlock({ block }: ContentBlockProps) {
  const { type, content, attrs, text } = block;

  switch (type) {
    case 'doc':
      return (
        <div>
          {content && <RichContentRenderer content={content} />}
        </div>
        );

    case 'paragraph':
      return (
        <p className="leading-relaxed">
          {content && <RichContentRenderer content={content} />}
          {text}
        </p>
      );

    case 'heading':
      const level = attrs?.level || 1;
      const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as keyof JSX.IntrinsicElements;
      const headingClasses = {
        1: "text-3xl font-bold tracking-tight",
        2: "text-2xl font-semibold tracking-tight",
        3: "text-xl font-semibold",
        4: "text-lg font-semibold",
        5: "text-base font-semibold",
        6: "text-sm font-semibold",
      };
      
      return (
        <HeadingTag className={headingClasses[level as keyof typeof headingClasses] || headingClasses[1]}>
          {content && <RichContentRenderer content={content} />}
          {text}
        </HeadingTag>
      );

    case 'text':
      let textElement = <span>{text}</span>;
      
      // Apply text formatting
      if (attrs?.bold) {
        textElement = <strong>{textElement}</strong>;
      }
      if (attrs?.italic) {
        textElement = <em>{textElement}</em>;
      }
      if (attrs?.underline) {
        textElement = <u>{textElement}</u>;
      }
      if (attrs?.code) {
        textElement = (
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {text}
          </code>
        );
      }
      
      return textElement;

    case 'link':
      const href = attrs?.href || '#';
      const isExternal = href.startsWith('http') && 
        (typeof window === 'undefined' || !href.includes(window.location.hostname));
      
      return (
        <Link
          href={href}
          target={attrs?.target || (isExternal ? '_blank' : '_self')}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          {content && <RichContentRenderer content={content} />}
          {text}
          {isExternal && <ExternalLink className="h-3 w-3" />}
        </Link>
      );

    case 'image':
      if (!attrs?.src) return null;
      
      return (
        <figure className="space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={attrs.src}
              alt={attrs.alt || 'Content image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {(attrs.alt || attrs.title) && (
            <figcaption className="text-sm text-muted-foreground text-center">
              {attrs.title || attrs.alt}
            </figcaption>
          )}
        </figure>
      );

    case 'blockquote':
      return (
        <Card className="border-l-4 border-primary">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <blockquote className="italic text-lg">
                {content && <RichContentRenderer content={content} />}
                {text}
              </blockquote>
            </div>
          </CardContent>
        </Card>
      );

    case 'codeBlock':
      return (
        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-muted p-4">
            <code className="font-mono text-sm">
              {attrs?.language && (
                <div className="mb-2 text-xs text-muted-foreground">
                  {attrs.language}
                </div>
              )}
              {text || (content && <RichContentRenderer content={content} />)}
            </code>
          </pre>
        </div>
        );

    case 'bulletList':
      return (
        <ul className="space-y-2 pl-6 list-disc">
          {content && <RichContentRenderer content={content} />}
        </ul>
      );

    case 'orderedList':
      return (
        <ol className="space-y-2 pl-6 list-decimal">
          {content && <RichContentRenderer content={content} />}
        </ol>
      );

    case 'listItem':
      return (
        <li>
          {content && <RichContentRenderer content={content} />}
          {text}
        </li>
      );

    case 'horizontalRule':
      return <Separator className="my-8" />;

    case 'hardBreak':
      return <br />;

    // Custom content blocks
    case 'alert':
      const alertType = attrs?.type || 'info';
      const alertIcons = {
        info: Info,
        warning: AlertTriangle,
        error: AlertTriangle,
        success: CheckCircle,
      };
      const AlertIcon = alertIcons[alertType as keyof typeof alertIcons] || Info;
      
      return (
        <Alert>
          <AlertIcon className="h-4 w-4" />
          <AlertDescription>
            {content && <RichContentRenderer content={content} />}
            {text}
          </AlertDescription>
        </Alert>
      );

    case 'callout':
      return (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            {attrs?.title && (
              <h4 className="font-semibold mb-3">{attrs.title}</h4>
            )}
            <div>
              {content && <RichContentRenderer content={content} />}
              {text}
            </div>
          </CardContent>
        </Card>
      );

    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <tbody>
              {content && <RichContentRenderer content={content} />}
            </tbody>
          </table>
        </div>
        );

    case 'tableRow':
      return (
        <tr className="border-b border-border">
          {content && <RichContentRenderer content={content} />}
        </tr>
      );

    case 'tableCell':
    case 'tableHeader':
      const CellTag = type === 'tableHeader' ? 'th' : 'td';
      return (
        <CellTag className="border border-border p-3 text-left">
          {content && <RichContentRenderer content={content} />}
          {text}
        </CellTag>
      );

    case 'embed':
      // Handle various embed types (video, iframe, etc.)
      if (attrs?.type === 'youtube' && attrs?.videoId) {
        return (
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${attrs.videoId}`}
              title={attrs.title || 'YouTube video'}
              className="absolute inset-0 h-full w-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      }
      
      if (attrs?.src) {
        return (
          <div className="relative aspect-video">
            <iframe
              src={attrs.src}
              title={attrs.title || 'Embedded content'}
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          </div>
        );
      }
      
      return null;

    default:
      // Fallback for unknown block types
      console.warn(`Unknown content block type: ${type}`);
      return (
        <div className="p-4 bg-muted/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            Unsupported content type: {type}
          </p>
          {text && <p className="mt-2">{text}</p>}
          {content && <RichContentRenderer content={content} />}
        </div>
        );
  }
}

/**
 * Smart field renderer that detects and renders images, links, etc.
 */
interface GenericFieldRendererProps {
  fieldName: string;
  value: any;
  contentType: string;
}

function GenericFieldRenderer({ fieldName, value, contentType }: GenericFieldRendererProps) {
  // Skip null/undefined values
  if (value == null) return null;

  const valueStr = String(value);

  // Check if it's an image URL
  const isImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    // Check for common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)(\?.*)?$/i;
    if (imageExtensions.test(url)) return true;

    // Check for common CDN/storage patterns
    const imageCdnPatterns = [
      /amazonaws\.com.*\.(jpg|jpeg|png|gif|webp)/i,
      /cloudinary\.com/i,
      /imgix\.net/i,
      /s3\..*\.amazonaws\.com/i,
      /cognotor\.s3\./i, // Cognitor specific
    ];
    
    return imageCdnPatterns.some(pattern => pattern.test(url));
  };

  // Check if it's a URL
  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return text.startsWith('http://') || text.startsWith('https://');
    } catch {
      return false;
    }
  };

  // Image field renderer
  if (isImageUrl(valueStr)) {
    const altText = fieldName.includes('title') ? value : 
                   fieldName.includes('name') ? value : 
                   `${fieldName} image`;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground capitalize">
          {fieldName.replace(/[_-]/g, ' ')}
        </div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={valueStr}
            alt={altText}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      </div>
    );
  }

  // URL field renderer  
  if (isUrl(valueStr)) {
    return (
      <div className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground capitalize">
          {fieldName.replace(/[_-]/g, ' ')}
        </div>
        <Link 
          href={valueStr} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          {valueStr}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  // Array/List field renderer (check for references)
  if (Array.isArray(value)) {
    // Check if it looks like a reference list
    const isReferenceList = fieldName.includes('id') || 
                           fieldName.includes('ref') || 
                           fieldName.includes('news') ||
                           fieldName.includes('article') ||
                           fieldName.includes('post');

    if (isReferenceList && value.length > 0) {
      return (
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground capitalize">
            {fieldName.replace(/[_-]/g, ' ')}
          </div>
          <ContentReferenceList 
            data={{ [fieldName]: value, title: fieldName.replace(/[_-]/g, ' ') }} 
            contentType={fieldName} 
          />
        </div>
        );
    }

    // Regular array display
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground capitalize">
          {fieldName.replace(/[_-]/g, ' ')}
        </div>
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  // Object field renderer
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground capitalize">
          {fieldName.replace(/[_-]/g, ' ')}
        </div>
        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }

  // Boolean field renderer
  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {fieldName.replace(/[_-]/g, ' ')}:
        </span>
        <Badge variant={value ? "default" : "secondary"} className="text-xs">
          {value ? 'Yes' : 'No'}
        </Badge>
      </div>
    );
  }

  // Default text renderer
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-muted-foreground capitalize">
        {fieldName.replace(/[_-]/g, ' ')}
      </div>
      <div className="text-sm text-foreground">
        {typeof value === 'string' ? (
          <p>{value}</p>
        ) : typeof value === 'number' ? (
          <p>{value}</p>
        ) : typeof value === 'object' && value !== null ? (
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
            {JSON.stringify(value, null, 2)}
          </pre>
        ) : (
          <p>{String(value)}</p>
        )}
      </div>
    </div>
  );
}