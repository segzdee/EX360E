export default function handler(req, res) {
  // This is a mock API response. In a real app, you'd fetch this from a database
  const posts = [
    { slug: 'first-post', title: 'Our First Blog Post' },
    { slug: 'second-post', title: 'Exciting New Features' },
  ]

  res.status(200).json(posts)
}

