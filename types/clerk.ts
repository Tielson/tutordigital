export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      schoolId?: string;
      schoolName?: string;
      schoolSlug?: string;
      schoolLogoUrl?: string | null;
    }
  }
}