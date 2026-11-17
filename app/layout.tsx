import './globals.css';
import { Fraunces, Manrope, Space_Grotesk } from 'next/font/google';
const fr = Fraunces({ subsets: ['latin'], variable: '--f-fr' });
const mn = Manrope({ subsets: ['latin'], variable: '--f-mn' });
const sg = Space_Grotesk({ subsets: ['latin'], variable: '--f-sg' });
export const metadata = { title: 'NEPTUNE', description: 'Cognitive and emotional growth platform' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-t="obsidian" className={`${fr.variable} ${mn.variable} ${sg.variable}`}><body>{children}</body></html>;
}