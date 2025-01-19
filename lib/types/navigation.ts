export type NavigationItem = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  role?: 'company' | 'recruiter' | 'freelancer' | 'admin'
}

export type NavigationSection = {
  title: string
  items: NavigationItem[]
} 