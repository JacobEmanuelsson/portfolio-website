import "./globals.css";

export const metadata = {
  title: "Jacob Emanuelsson | Portfolio",
  description: "Interactive portfolio website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
