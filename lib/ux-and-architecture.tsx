import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Layers } from 'lucide-react'

export default function UXAndArchitecture() {
  const [activeTab, setActiveTab] = useState("ux")

  const sections = {
    ux: {
      title: "User Experience (UX) Improvements",
      description: "Enhancing user interaction and satisfaction",
      items: [
        {
          title: "Intuitive Interface",
          features: [
            "Streamlined dashboards with clear navigation",
            "Minimal clicks to perform common tasks (posting shifts, applying, etc.)"
          ]
        },
        {
          title: "Onboarding Tutorials",
          features: [
            "Interactive step-by-step guides for new clients, staff, and agencies"
          ]
        },
        {
          title: "Accessibility",
          features: [
            "WCAG Compliance for color contrast, screen reader support",
            "Customizable UI (font sizes, language)"
          ]
        },
        {
          title: "Performance Optimization",
          features: [
            "Fast Load Times and caching for shift listings",
            "Scalability to handle large user volumes and real-time data"
          ]
        }
      ]
    },
    architecture: {
      title: "High-Level System Architecture",
      description: "Conceptual breakdown of the platform's technical structure",
      items: [
        {
          title: "Frontend (Web + Mobile)",
          features: [
            "Built with modern JS frameworks (React, Vue, or Angular)",
            "Mobile app (React Native, Flutter, or native iOS/Android)"
          ]
        },
        {
          title: "Backend (REST or GraphQL API)",
          features: [
            "Manages user authentication, shift postings, payments, notifications",
            "Possibly Node.js / Python / Java / .NET, depending on the team's preference"
          ]
        },
        {
          title: "Database Layer",
          features: [
            "Relational DB (e.g., PostgreSQL, MySQL) for structured data",
            "NoSQL (e.g., MongoDB) for flexible data or high concurrency scenarios",
            "Payment logs might be stored separately or with versioned records for auditing"
          ]
        },
        {
          title: "Payment Gateway & Escrow",
          features: [
            "Integration with Stripe, PayPal, or a specialized escrow provider",
            "Automated calculation for platform fees, staff/agency payouts, refunds, disputes"
          ]
        },
        {
          title: "Notification Service",
          features: [
            "Could use WebSocket or 3rd-party (Firebase, OneSignal) for push notifications"
          ]
        },
        {
          title: "Search & Matching",
          features: [
            "Potential for an internal search service (Elasticsearch, Algolia, or built-in SQL queries) to match staff with shifts"
          ]
        },
        {
          title: "Analytics & Reports",
          features: [
            "Business intelligence layer for advanced analytics, stored in data warehouse or BI tool"
          ]
        },
        {
          title: "Admin Panel",
          features: [
            "Super-admins can resolve disputes, manage site content, view global analytics"
          ]
        }
      ]
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>EXTRASTAFF360 Platform Overview</CardTitle>
        <CardDescription>Explore our UX improvements and system architecture</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ux">UX Improvements</TabsTrigger>
            <TabsTrigger value="architecture">System Architecture</TabsTrigger>
          </TabsList>
          {Object.entries(sections).map(([key, section]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {key === 'ux' ? <CheckCircle className="w-6 h-6 mr-2" /> : <Layers className="w-6 h-6 mr-2" />}
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full pr-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

