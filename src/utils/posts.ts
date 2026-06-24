import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type PostImage = {
  url: string;
  alt: string;
  caption?: string;
};

type PostDataLike = {
  postType?: 'article' | 'photo';
  images?: PostImage[];
};

function toPostData(input: PostEntry | PostDataLike | null | undefined): PostDataLike {
  if (!input) {
    return {};
  }

  if ('data' in input) {
    return input.data;
  }

  return input;
}

export function isPhotoPost(input: PostEntry | PostDataLike | null | undefined): boolean {
  const data = toPostData(input);
  return data.postType === 'photo' || (Array.isArray(data.images) && data.images.length > 0);
}

export function getPostType(input: PostEntry | PostDataLike | null | undefined): 'photo' | 'article' {
  return isPhotoPost(input) ? 'photo' : 'article';
}

export function getPhotoImages(input: PostEntry | PostDataLike | null | undefined): PostImage[] {
  const data = toPostData(input);
  return Array.isArray(data.images) ? data.images : [];
}

export function getPhotoThumbnail(input: PostEntry | PostDataLike | null | undefined): PostImage | null {
  const images = getPhotoImages(input);
  return images.length > 0 ? images[0] : null;
}
