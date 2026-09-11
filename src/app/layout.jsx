import "./globals.css";
import Backdrop from "@/experience/Backdrop";

export const metadata = {
  title: "Jacob Emanuelsson | Portfolio",
  description: "Interactive constellation portfolio.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Backdrop />

      </body>
    </html>
  );
}
