import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Registration | Plataforma de Cadastro",
  description: "Facilitamos o cadastro de estudantes com uma plataforma intuitiva e eficiente.",
  openGraph: {
    title: "Student Registration | Plataforma de Cadastro",
    description: "Facilitamos o cadastro de estudantes com uma plataforma intuitiva e eficiente.",
    url: "https://student-registration.com",
    siteName: "Student Registration",
    images: [
      {
        url: "https://student-registration.com/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Student Registration - Plataforma de Cadastro",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Registration | Plataforma de Cadastro",
    description: "Facilitamos o cadastro de estudantes com uma plataforma intuitiva e eficiente.",
    images: ["https://student-registration.com/placeholder-logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};