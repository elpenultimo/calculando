export const metadata = {
  title: "Calculando",
  description: "Calculadoras simples",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
