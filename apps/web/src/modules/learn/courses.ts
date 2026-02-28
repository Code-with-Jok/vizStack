import type { CourseDefinition } from "./types";
import { reactCourse } from "./reactCourse";

export const COURSES: CourseDefinition[] = [reactCourse];

export const courseBySlug = COURSES.reduce(
  (acc, course) => {
    acc[course.slug] = course;
    return acc;
  },
  {} as Record<string, CourseDefinition>
);
