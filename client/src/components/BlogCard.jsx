import { useState, useEffect } from 'react'

const BlogCard = ({ blog }) => {
    const [blogPost, setBlogPost] = useState(null)


    console.log('blog from blogcard:', blog)

    useEffect(() => {
        if (blog.id) { // Only attempt fetch if blog.id exists
          fetch(`http://localhost:3000/api/blogs/${blog.id}/articles`)
            .then((resp) => resp.json())
            .then((data) => setBlogPost(data))
            .catch(error => console.error('Error fetching blog post:', error));
        }
      }, [blog.id]); // Add blog.id as a dependency to ensure it updates

      console.log('blogpst:', blogPost)



      return (
        <div className="blog-container">
          <h2 style={{ color: 'green' }}>Our Video Blogs</h2>
          <div key={blogPost.id} className="blog-post">
            <h3>{blogPost.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: blogPost.contentHtml }}></div>
            {blogPost.metafields && blogPost.metafields.custom_video && (
              <div className="video-embed">
                <iframe
                  width="560"
                  height="315"
                  src={blogPost.metafields.custom_video.value} // Use blogPost here
                  title={blogPost.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      );
    }
    

export default BlogCard