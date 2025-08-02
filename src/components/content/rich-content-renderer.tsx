/**
 * Rich Content Renderer - Renders dynamic CMS content blocks
 */

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Quote, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RichContent, PageElement, ContentElement } from "@/lib/types";

interface RichContentRendererProps {
  content?: RichContent[];
  pageElements?: PageElement[];
}

export function RichContentRenderer({ content, pageElements }: RichContentRendererProps) {
  // Prioritize pageElements (new format) over legacy content
  if (pageElements && Array.isArray(pageElements) && pageElements.length > 0) {
    return (
      <div className="space-y-6">
        {pageElements
          .sort((a, b) => a.position - b.position) // Sort by position
          .map((element) => (
            <PageElementRenderer key={element.id} element={element} />
          ))}
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

    default:
      // Generic renderer for unknown content types
      return (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Content Type: {type_identifier}
              </div>
              {data.title && (
                <h3 className="text-lg font-semibold">{data.title}</h3>
              )}
              {data.content && (
                <p className="text-muted-foreground">{data.content}</p>
              )}
              {/* Render other data fields */}
              {Object.entries(data)
                .filter(([key]) => !['title', 'content'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{key}:</span>{' '}
                    <span className="text-muted-foreground">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      );
  }
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
      const isExternal = href.startsWith('http') && !href.includes(window?.location?.hostname);
      
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