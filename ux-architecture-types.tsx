// types/platform.ts
export interface Feature {
  title: string;
  features: string[];
}

export interface Section {
  title: string;
  description: string;
  items: Feature[];
}

export interface PlatformSections {
  ux: Section;
  architecture: Section;
}

// Constants for reusability
export const PLATFORM_SECTIONS: PlatformSections = {
  ux: {
    title: "User Experience (UX) Improvements",
    description: "Enhancing user interaction and satisfaction",
    items: [
      {
        title: "Intuitive Interface",
        features: [
          "Streamlined dashboards with clear navigation",
          "Minimal clicks to perform common tasks"
        ]
      },
      // ... other UX items
    ]
  },
  architecture: {
    title: "High-Level System Architecture",
    description: "Conceptual breakdown of the platform's technical structure",
    items: [
      {
        title: "Frontend (Web + Mobile)",
        features: [
          "Built with modern JS frameworks",
          "Mobile app support"
        ]
      },
      // ... other architecture items
    ]
  }
}