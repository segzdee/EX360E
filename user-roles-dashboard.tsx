// types/roles.ts
export interface RoleFeature {
  title: string;
  description: string;
  features: string[];
}

export const USER_ROLES: Record<string, RoleFeature> = {
  client: {
    title: "Client Dashboard",
    description: "For hospitality companies and individuals",
    features: [
      "Login & Security with 2FA",
      "Active Shifts Overview",
      "Staff Performance Metrics",
      // ... other features
    ]
  },
  staff: {
    title: "Extra Staff Dashboard",
    description: "For freelance hospitality professionals",
    features: [
      "Login & Security with 2FA",
      "Profile Setup",
      "Availability Management",
      // ... other features
    ]
  },
  agency: {
    title: "Agency Dashboard",
    description: "For recruitment agencies",
    features: [
      "Login & Security with Team Roles",
      "Staff Management",
      "Client Management",
      // ... other features
    ]
  }
} as const;

export type UserRoleType = keyof typeof USER_ROLES;