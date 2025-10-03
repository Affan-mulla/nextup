import { LexicalJsonNode } from "@/types/lexical-json";

interface ReplaceOpts {
  maxImages?: number; // optional cap (e.g. 2)
  failIfInsufficientUrls?: boolean; // throw if urls < images found
}

export function replaceImagesFromLexical(
  root: LexicalJsonNode | undefined,
  urls: string | string[],
  opts: ReplaceOpts = {}
): LexicalJsonNode | undefined {
  if (!root) return root;

  // Normalize urls to array
  const urlArray = typeof urls === "string" ? [urls] : urls;
  const cloned: LexicalJsonNode = JSON.parse(JSON.stringify(root));

  let imgIndex = 0;
  let foundImages = 0;

  function traverse(node: LexicalJsonNode): LexicalJsonNode {
    // If this node is an image node, replace src
    if (node.type === "image" && typeof node.src === "string") {
      foundImages++;

      if (opts.maxImages !== undefined && foundImages > opts.maxImages) {
        throw new Error(`Max ${opts.maxImages} images allowed`);
      }

      if (urlArray.length === 0) {
        if (opts.failIfInsufficientUrls) {
          throw new Error("No replacement URLs provided for images");
        }
        return node; // nothing to replace
      }

      if (imgIndex >= urlArray.length) {
        if (opts.failIfInsufficientUrls) {
          throw new Error("Not enough URLs provided for all images");
        }
        node.src = urlArray[urlArray.length - 1];
      } else {
        node.src = urlArray[imgIndex];
      }

      imgIndex++;
      return node;
    }

    // Recurse into children
    if (Array.isArray(node.children)) {
      node.children = node.children.map(traverse);
    }

    // Recurse into any other object-like fields
    for (const key of Object.keys(node)) {
      const value = node[key];
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          node[key] = value.map((v: LexicalJsonNode) =>
            typeof v === "object" ? traverse(v as LexicalJsonNode) : v
          );
        } else {
          node[key] = traverse(value as LexicalJsonNode);
        }
      }
    }

    return node;
  }

  return traverse(cloned);
}
