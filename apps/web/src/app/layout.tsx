import "./globals.css";

export const metadata = {
  title: "APP RRHH",
  description: "Bienestar psicológico + productividad"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-md p-4">{children}</div>
      </body>
    </html>
  );
}
