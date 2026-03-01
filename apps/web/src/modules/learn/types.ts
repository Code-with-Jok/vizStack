export interface CourseSection {
  key: string;
  slug: string;
  icon: string;
  colorVar: string;
  ready: boolean;
  topics: string[];
}

export interface CourseDefinition {
  key: string;
  slug: string;
  icon: string;
  gradient: string;
  accentColor: string;
  featuredTags: string[];
  sections: CourseSection[];
}
