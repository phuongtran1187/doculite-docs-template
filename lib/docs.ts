import { docs } from "#site/content";

export function getDocBySlug(slug: string) {
  return docs.find((doc) => doc.slugAsParams === slug);
}

export function getAllDocs() {
  return docs.filter((doc) => doc.published);
}

export function getDocsByDirectory(dir: string) {
  return docs
    .filter((doc) => doc.slugAsParams.startsWith(dir))
    .sort((a, b) => a.order - b.order);
}
