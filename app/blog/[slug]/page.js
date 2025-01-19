export default function BlogPost({ params }) {
  // In a real app, you'd fetch the post data based on the slug
  const post = {
    title: `Blog Post: ${params.slug}`,
    content: 'This is the content of the blog post.',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}

