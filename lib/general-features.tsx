import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Shield, Bell, Globe, DollarSign, Scale, LifeBuoy } from 'lucide-react'

export default function GeneralFeatures() {
  const features = [
    {
      title: "Mobile Application & Responsive Web",
      icon: Smartphone,
      items: [
        "Cross-platform support (iOS, Android, Web)",
        "Native apps or responsive web approach"
      ]
    },
    {
      title: "Enhanced Security",
      icon: Shield,
      items: [
        "Activity Logs (audit trails)",
        "Data Encryption (in transit + at rest)",
        "Role-Based Access Control (RBAC)"
      ]
    },
    {
      title: "Notifications & Alerts",
      icon: Bell,
      items: [
        "Real-Time Push (for shifts, approvals)",
        "Email/SMS Integration for critical updates"
      ]
    },
    {
      title: "Multi-Language & Localization",
      icon: Globe,
      items: [
        "Language Options for global reach",
        "Localized Payment Methods and currency support"
      ]
    },
    {
      title: "Escrow & Financial Transparency",
      icon: DollarSign,
      items: [
        "Detailed Transaction History for each user",
        "Escrow Status Indicators (funded, in dispute, released)"
      ]
    },
    {
      title: "Compliance & Legal",
      icon: Scale,
      items: [
        "Regulatory Compliance (labor laws, GDPR)",
        "Contract Templates auto-generated for each engagement"
      ]
    },
    {
      title: "Dispute Resolution",
      icon: LifeBuoy,
      items: [
        "Ticketing System with internal escalation",
        "Mediator Role (platform admins)"
      ]
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">General Platform Features</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <feature.icon className="w-6 h-6 mr-2" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

