import Link from 'next/link'

export default function BlogIndex() {
  // This would typically fetch from an API or database
  const posts = [
    { slug: 'first-post', title: 'Our First Blog Post' },
    { slug: 'second-post', title: 'Exciting New Features' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2">
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

