import { siteConfig, SITE_URL } from '../config/seo';
import type { MetaTag, JsonLdObject } from '../config/seo';

export interface GenerateMetaTagsOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  pubDate?: string;
  updatedDate?: string;
  tags?: string[];
  author?: string;
}

export function generateMetaTags(options: GenerateMetaTagsOptions): MetaTag[] {
  const {
    title,
    description = siteConfig.description,
    canonicalPath,
    ogImage,
    ogType = 'website',
    pubDate,
    updatedDate,
    tags,
    author = siteConfig.author,
  } = options;

  const fullTitle = title.includes(siteConfig.title) ? title : `${title} | ${siteConfig.title}`;
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;
  const resolvedOgImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
    : `${SITE_URL}${siteConfig.ogImage}`;

  const tagsList: MetaTag[] = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: resolvedOgImage },
    { property: 'og:site_name', content: siteConfig.title },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: resolvedOgImage },
  ];

  if (ogType === 'article') {
    if (pubDate) {
      tagsList.push({ property: 'article:published_time', content: pubDate });
    }
    if (updatedDate) {
      tagsList.push({ property: 'article:modified_time', content: updatedDate });
    }
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        tagsList.push({ property: 'article:tag', content: tag });
      }
    }
    if (author) {
      tagsList.push({ name: 'author', content: author });
    }
  }

  return tagsList;
}

export interface GenerateJsonLdOptions {
  type: string;
  title: string;
  description?: string;
  canonicalPath?: string;
  pubDate?: string;
  updatedDate?: string;
  tags?: string[];
  author?: string;
  breadcrumbs?: { name: string; url: string }[];
}

export function generateJsonLd(options: GenerateJsonLdOptions): JsonLdObject {
  const {
    type,
    title,
    description = siteConfig.description,
    canonicalPath,
    pubDate,
    updatedDate,
    tags,
    author = siteConfig.author,
    breadcrumbs,
  } = options;

  const canonicalUrl = canonicalPath
    ? canonicalPath === '/'
      ? SITE_URL
      : `${SITE_URL}${canonicalPath}`
    : SITE_URL;

  const base: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': type,
    url: canonicalUrl,
  };

  if (type === 'WebSite') {
    return {
      ...base,
      name: title,
      description,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.title,
        url: SITE_URL,
      },
    };
  }

  if (type === 'Article') {
    return {
      ...base,
      headline: title,
      description,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.title,
        url: SITE_URL,
      },
      datePublished: pubDate,
      dateModified: updatedDate ?? pubDate,
      keywords: tags?.join(', ') ?? '',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };
  }

  if (type === 'CollectionPage') {
    return {
      ...base,
      name: title,
      description,
      isPartOf: {
        '@type': 'WebSite',
        name: siteConfig.title,
        url: SITE_URL,
      },
    };
  }

  if (type === 'BreadcrumbList' && breadcrumbs && breadcrumbs.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      })),
    };
  }

  return base;
}
