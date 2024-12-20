import React, { useState } from 'react';

const BlogCard = ({ blog }) => {
  const [isLarge, setIsLarge] = useState(false);

  // Extract the YouTube video URL if present in the contentHtml
  const videoUrlMatch = blog.contentHtml
    ? blog.contentHtml.match(/https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/)
    : null;

  const videoUrl = videoUrlMatch ? videoUrlMatch[0].replace('watch?v=', 'embed/') : null;

  const toggleVideoSize = () => {
    setIsLarge(!isLarge);
  };

  return (
    <div className="blog-container" style={styles.container}>
      

      <div key={blog.id} className="blog-post" style={styles.blogPost}>
        <h3 style={styles.title}>{blog.title}</h3>

        <p style={styles.content}>{blog.excerpt}</p>

        {videoUrl && (
          <div
            className={`video-embed ${isLarge ? 'large' : ''}`}
            style={isLarge ? styles.videoLarge : styles.videoSmall}
            onClick={toggleVideoSize}
            onMouseEnter={(e) => e.target.play && e.target.play()}
            onMouseLeave={(e) => e.target.pause && e.target.pause()}
          >
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title={blog.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    backgroundColor: '#f0fff4',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px auto',
    maxWidth: '800px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '20px',
  },
  blogPost: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  title: {
    color: '#2f4f2f',
    marginBottom: '10px',
  },
  content: {
    color: '#555',
    marginBottom: '15px',
  },
  videoSmall: {
    width: '100%',
    height: '315px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  videoLarge: {
    width: '100%',
    height: '500px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    transform: 'scale(1.05)',
  },
};

export default BlogCard;