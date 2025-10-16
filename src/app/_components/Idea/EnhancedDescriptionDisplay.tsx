"use client";
import { useState, useEffect } from "react";
import { LexicalNode, SerializedEditorState } from "lexical";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WrapperDescriptionDisplay from "./DescriptionDisplay";
import { LexicalJsonNode } from "@/types/lexical-json";

interface ImageData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface EnhancedDescriptionDisplayProps {
  content: SerializedEditorState | undefined;
}

const EnhancedDescriptionDisplay = ({ content }: EnhancedDescriptionDisplayProps) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredContent, setFilteredContent] = useState<SerializedEditorState | undefined>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (content) {
      console.log("🔍 Processing content:", content);
      extractImagesFromContent(content);
    }
  }, [content]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCarouselOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeCarousel();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCarouselOpen]);

  // Touch/swipe support for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  const extractImagesFromContent = (editorState: SerializedEditorState) => {
    try {
      const images: ImageData[] = [];
      const clonedContent = JSON.parse(JSON.stringify(editorState));

      const extractFromNode = (node: LexicalJsonNode) => {
        // Check for different image node types
        if ((node.type === "image" || node.__type === "image") && node.src) {
          images.push({
            src: node.src,
            alt: node.altText as string || node.alt as string || "",
            width: node.width as number,
            height: node.height as number,
          });
        }

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(extractFromNode);
        }
      };

      if (clonedContent.root && clonedContent.root.children) {
        clonedContent.root.children.forEach(extractFromNode);
      }

      setImages(images);
      console.log("🖼️ Extracted images:", images);

      // Create content without images for the text display
      const contentWithoutImages = removeImagesFromContent(clonedContent);
      console.log("📝 Content without images:", contentWithoutImages);
      
      // Only set filtered content if there's actual text content remaining
      const hasTextContent = contentWithoutImages?.root?.children?.some((child: LexicalJsonNode) => 
        child.type === "paragraph" || child.type === "heading" || 
        (child.children && child.children.length > 0)
      );
      
      console.log("✅ Has text content:", hasTextContent);
      setFilteredContent(hasTextContent ? contentWithoutImages : undefined);
    } catch (error) {
      console.error("Error extracting images:", error);
      setFilteredContent(content);
    }
  };

  const removeImagesFromContent = (content: SerializedEditorState): SerializedEditorState => {
    const traverse = (node: LexicalJsonNode): LexicalJsonNode => {
      if (!node || typeof node !== "object") return node;
      
      // Remove image nodes completely
      if (node.type === "image" || node.__type === "image") {
        return null as unknown as LexicalJsonNode;
      }
  
      if (node.children && Array.isArray(node.children)) {
        // Recursively process children and filter out nulls
        const filteredChildren = node.children
          .map(traverse)
          .filter((child: LexicalJsonNode) => child !== null && child !== undefined);
        
        // If no children left and this is not a text node, remove the node
        if (filteredChildren.length === 0 && node.type !== "text") {
          return null as unknown as LexicalJsonNode;
        }
        
        return {
          ...node,
          children: filteredChildren
        };
      }
      
      return node;
    };
  
    const cloned = JSON.parse(JSON.stringify(content));
    if (cloned.root) {
      cloned.root = traverse(cloned.root);
    }
    return cloned;
  };
  

  const openCarousel = (index: number) => {
    setCurrentImageIndex(index);
    setIsCarouselOpen(true);
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full space-y-8">
      {/* Description Text First */}
      {filteredContent ? (
        <div className="space-y-1">
          <div className="prose prose-neutral max-w-none prose-lg prose-headings:font-outfit prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r prose-ul:list-disc prose-ol:list-decimal prose-li:text-foreground/90 prose-li:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <WrapperDescriptionDisplay content={filteredContent} />
          </div>
        </div>
      ) : images.length > 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>This idea contains only images.</p>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No description content available.</p>
        </div>
      )}

      {/* Images Gallery Below Description */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h3 className="text-lg font-outfit font-semibold text-foreground">
              Images ({images.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-xl overflow-hidden bg-muted/20 border border-border/30 hover:border-border/60 transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => openCarousel(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Carousel Modal */}
      {isCarouselOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
              onClick={closeCarousel}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div 
              className="flex items-center justify-center h-full"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={images[currentImageIndex]?.src}
                alt={images[currentImageIndex]?.alt || `Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg select-none"
                draggable={false}
              />
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-md overflow-hidden transition-opacity duration-200 ${
                      index === currentImageIndex ? "opacity-100 ring-2 ring-white" : "opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => goToImage(index)}
                  >
                    <img
                      src={images[index].src}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDescriptionDisplay;
