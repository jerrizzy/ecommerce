import { useState, useEffect } from 'react'

const BlogCard = ({ blog }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log('blog from blogcard:', blog)

    useEffect(() => {
        // Fetch the blog articles by blog ID
        if (blog.id) {
          fetch(`http://localhost:3000/api/blogs/${blog.id}/articles`)
            .then((resp) => resp.json())
            .then((data) => {
              console.log('Fetched blog articles:', data); // Log fetched data
              // Sort posts by date (most recent first)
              const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              setBlogPosts(sortedData);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching blog post:', error);
              setLoading(false);
            });
        }
      }, [blog.id]);

      console.log('blogpst:', blogPosts)

      if (loading) return <p>Loading blog posts...</p>;

  
  return (
    <div className="blog-container">
      <h2 style={{ color: 'green' }}>Our Video Blogs</h2>
      {blogPosts.map((post) => {
        // Extract the video URL if present
        const videoUrl = post.body_html
        // Extract YouTube link from body_html if it’s just a link
          ? post.body_html.match(/https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/)
          : null;

        return (
          <div key={post.id} className="blog-post">
            <h3 style={{ color: 'black' }}>{post.title}</h3>
            
            {videoUrl && videoUrl[0] && (
              <div className="video-embed">
                <iframe
                  width="560"
                  height="315"
                  src={videoUrl[0].replace('watch?v=', 'embed/')} // Convert to embed URL
                  title={post.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BlogCard;