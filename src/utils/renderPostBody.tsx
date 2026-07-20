import parse, { HTMLReactParserOptions } from "html-react-parser";
import { PostImage } from "../components/PostImage";

const options: HTMLReactParserOptions = {
  replace: (node: any) => {
    if (node?.type === "tag" && node.name === "img") {
      const { src, alt, class: className } = node.attribs || {};
      return (
        <PostImage src={src} alt={alt ?? ""} className={className} width={1000} />
      );
    }
  },
};

/**
 * Parses sanitized post HTML, swapping <img> tags for <PostImage> so broken
 * Cloudinary URLs (wrong tmp/permanent folder) recover automatically.
 */
export const renderPostBody = (html: string) => parse(html, options);
