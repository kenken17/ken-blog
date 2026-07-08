import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type PostImage = {
  url: string;
  alt: string;
  caption?: string;
};

export type PostVideo = {
  type: 'upload' | 'embed';
  url: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
};

type PostDataLike = {
  postType?: 'article' | 'photo' | 'video';
  images?: PostImage[];
  video?: PostVideo;
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

export function isVideoPost(input: PostEntry | PostDataLike | null | undefined): boolean {
  const data = toPostData(input);
  return data.postType === 'video' || Boolean(data.video && typeof data.video === 'object');
}

export function getPostType(input: PostEntry | PostDataLike | null | undefined): 'photo' | 'video' | 'article' {
  if (isVideoPost(input)) return 'video';
  if (isPhotoPost(input)) return 'photo';
  return 'article';
}

export function getPhotoImages(input: PostEntry | PostDataLike | null | undefined): PostImage[] {
  const data = toPostData(input);
  return Array.isArray(data.images) ? data.images : [];
}

export function getPhotoThumbnail(input: PostEntry | PostDataLike | null | undefined): PostImage | null {
  const images = getPhotoImages(input);
  return images.length > 0 ? images[0] : null;
}

export function getPostVideo(input: PostEntry | PostDataLike | null | undefined): PostVideo | null {
  const data = toPostData(input);
  return data.video && typeof data.video === 'object' ? data.video : null;
}
