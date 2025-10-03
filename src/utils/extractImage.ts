import { LexicalJsonNode } from "@/types/lexical-json";


export function extractImagesFromLexical(node?: LexicalJsonNode, images: LexicalJsonNode[] = []) {
    
    if (!node) return images;

    // If this node is an image
    if (node.type === "image" && node.src && node.src.startsWith("data:image/png;base64")) {
      images.push(node);
    }

    // If this node has children, recurse
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        extractImagesFromLexical(child, images);
      }
    }

    return images;
  }