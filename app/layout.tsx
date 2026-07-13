import type {Metadata} from 'next';
import { AppProvider } from '../lib/context';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Nexora - Premium IPTV Player & Stream Hub',
  description: 'Nexora is a feature-rich, high-performance web IPTV aggregator and streaming client. Import M3U/M3U8 playlists and Xtream Codes servers to play live channels seamlessly with built-in analytics, favorites, and custom visual skins.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark bg-black">
      <body suppressHydrationWarning className="bg-[#09090B] text-slate-200 min-h-screen antialiased selection:bg-indigo-600/20 selection:text-indigo-200">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
