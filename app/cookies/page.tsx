import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Cookies() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Cookies Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. What are Cookies?</h2>
          <p>Cookies are small pieces of data stored on your device (computer or mobile device) when you visit a website.</p>
          
          <h2>2. How We Use Cookies</h2>
          <p>We use cookies to remember your preferences, understand how you use our website, and customize your experience.</p>
          
          <h2>3. Types of Cookies We Use</h2>
          <ul>
            <li>Essential cookies: Necessary for the website to function properly.</li>
            <li>Analytical cookies: Help us understand how visitors interact with our website.</li>
            <li>Advertising cookies: Used to deliver relevant ads and track ad campaign performance.</li>
          </ul>
          
          <h2>4. Managing Cookies</h2>
          <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
          
          <h2>5. Changes to This Policy</h2>
          <p>We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page.</p>
        </CardContent>
      </Card>
    </div>
  )
}

