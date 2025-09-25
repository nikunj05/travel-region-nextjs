export interface BlogCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  // Add comment structure based on your API response
  // This is currently empty as the example shows comments: []
  id?: number;
  content?: string;
  author?: string;
  created_at?: string;
}

export interface Blog {
  id: number;
  category_id: number;
  title: string;
  content: string;
  image: string;
  full_image_url: string;
  read_time: number;
  is_featured: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  category: BlogCategory;
  comments: BlogComment[];
}

export interface BlogPagination {
  has_more_pages: boolean;
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  total: number;
}

export interface GetBlogsResponse {
  status: boolean;
  message: string;
  data: {
    blogs: Blog[];
    pagination: BlogPagination;
  };
}

export interface BlogFilters {
  is_featured?: number;
  category_id?: string; // Comma-separated string like "1,2,15"
  tags?: string; // Comma-separated string like "tag1,tag2,tag3"
  page?: number;
  per_page?: number;
}

export interface GetBlogDetailResponse {
  status: boolean;
  message: string;
  data: {
    blog: Blog;
    related_blogs: Blog[];
  };
}
