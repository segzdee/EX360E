import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Privacy() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process and complete transactions, and to send you related information including confirmations and invoices.</p>
          
          <h2>3. Information Sharing and Disclosure</h2>
          <p>We may share the information we collect with third parties as required by law, to protect our rights, or to provide our services.</p>
          
          <h2>4. Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          
          <h2>5. Your Choices</h2>
          <p>You may update, correct or delete information about you at any time by logging into your online account or by contacting us.</p>
        </CardContent>
      </Card>
    </div>
  )
}

