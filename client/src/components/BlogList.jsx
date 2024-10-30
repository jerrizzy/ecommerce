import React, { useEffect, useState } from 'react';
import { useLoaderData, Outlet } from 'react-router-dom';
import BlogCard from './BlogCard';

function BlogList() {
  const [loading, setLoading] = useState(true);

  const data = useLoaderData();
  const blogs = data.blogs;
  console.log(blogs);

  // Set loading to false once blogs are fetched
  useEffect(() => {
    if (blogs) {
      setLoading(false);
    }
  }, [blogs]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="bloglist">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default BlogList;
