import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations('Blogs');
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
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="read-more-btn"
        >
          {isExpanded ? t('readLess') : t('readMore')}
        </button>
      )}
    </div>
  );
};

export default BlogContent;
