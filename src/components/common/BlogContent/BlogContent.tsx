import React, { useState } from "react";
import { getPlainTextExcerpt } from "@/lib/contentUtils";

interface BlogContentProps {
  content: string;
  maxLength?: number;
  className?: string;
}

const BlogContent: React.FC<BlogContentProps> = ({
  content,
  maxLength = 200,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const plainTextContent = content.replace(/<[^>]*>/g, "");
  const shouldTruncate = plainTextContent.length > maxLength;

  const displayText = isExpanded
    ? plainTextContent
    : getPlainTextExcerpt(content, maxLength);

  return (
    <div className={className}>
      {displayText}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="read-more-btn"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default BlogContent;
