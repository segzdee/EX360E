export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = new FormData();
    Object.entries(req.body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add required Netlify form metadata
    formData.append('form-name', 'feedback');

    await fetch('/.netlify/functions/submission-created', {
      method: 'POST',
      body: formData,
    });

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting form' });
  }
}