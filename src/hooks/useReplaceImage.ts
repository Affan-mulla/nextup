type LexicalNode = any;

interface ReplaceOpts {
  maxImages?: number; // optional cap (e.g. 2)
  failIfInsufficientUrls?: boolean; // throw if urls < images found
}

export function replaceImagesFromLexical(
  root: LexicalNode,
  urls: string | string[],
  opts: ReplaceOpts = {}
): LexicalNode {
  if (!root) return root;

  // Normalize urls to array
  const urlArray = typeof urls === "string" ? [urls] : (urls ?? []);
  // Deep clone to avoid mutating original
  const cloned = JSON.parse(JSON.stringify(root));
  let imgIndex = 0;
  let foundImages = 0;

  function traverse(node: any): any {
    if (!node || typeof node !== "object") return node;

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

      // If fewer URLs than images, use the last URL by default (or throw if requested)
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

    // Recurse arrays
    if (Array.isArray(node)) {
      return node.map(traverse);
    }

    // Recurse object properties (covers nested editorState / caption fields)
    for (const key of Object.keys(node)) {
      node[key] = traverse(node[key]);
    }

    return node;
  }

  return traverse(cloned);
}
