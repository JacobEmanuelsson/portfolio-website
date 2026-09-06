import "./globals.css";
import Backdrop from "@/experience/Backdrop";

export const metadata = {
  title: "Jacob Emanuelsson | Portfolio",
  description: "Interactive constellation portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Backdrop />
        {children}
      </body>
    </html>
  );
}
