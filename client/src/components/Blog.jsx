import React, { useEffect, useState } from 'react';

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('blog posts object:', blogPosts);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/blog-posts', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setBlogPosts(data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="blog-container">
      <h2>Our Video Blogs</h2>
      {blogPosts.map((post) => (
        <div key={post.id} className="blog-post">
          <h3>{post.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }}></div>
          {post.metafields && post.metafields.custom_video && (
            <div className="video-embed">
              <iframe
                width="560"
                height="315"
                src={post.metafields.custom_video.value}
                title={post.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Blog;
