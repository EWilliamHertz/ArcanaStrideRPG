import './globals.css';

export const metadata = {
  title: 'Arcanastride 3D: MMORPG Chronicles | Global ARPG Realm',
  description: 'An international 3D MMORPG blending World of Warcraft Dungeons, Path of Exile Atlas mapping, and Diablo wargear itemization directly in your browser.',
  keywords: ['MMORPG', '3D RPG', 'ThreeJS', 'Path of Exile', 'Diablo', 'World of Warcraft', 'NextJS', 'Browser Game'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#070a14] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
