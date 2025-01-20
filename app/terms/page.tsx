import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Terms() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using EXTRASTAFF360, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h2>2. Use of Service</h2>
          <p>You agree to use EXTRASTAFF360 only for lawful purposes and in accordance with these Terms of Service.</p>
          
          <h2>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          
          <h2>4. Intellectual Property</h2>
          <p>The content, organization, graphics, design, and other matters related to EXTRASTAFF360 are protected under applicable copyrights and other proprietary laws.</p>
          
          <h2>5. Termination</h2>
          <p>We reserve the right to terminate or suspend your account and access to EXTRASTAFF360 at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of EXTRASTAFF360, us, or third parties, or for any other reason.</p>
        </CardContent>
      </Card>
    </div>
  )
}

