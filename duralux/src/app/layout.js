import { Inter } from 'next/font/google';
import '../assets/scss/theme.scss';
import './globals.css';
import NavigationProvider from '@/contentApi/navigationProvider';
import SettingSideBarProvider from '@/contentApi/settingSideBarProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Codyol | Dashboard',
  description: 'Codyol is a admin Dashboard create for multipurpose,',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>
        <SettingSideBarProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </SettingSideBarProvider>
      </body>
    </html>
  );
}