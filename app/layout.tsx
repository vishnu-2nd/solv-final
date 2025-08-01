@@ .. @@
 import type { Metadata } from 'next'
 import { Inter } from 'next/font/google'
 import './globals.css'
+import { Toaster } from 'react-hot-toast'

 const inter = Inter({ subsets: ['latin'] })
@@ .. @@
   return (
     <html lang="en">
       <body className={inter.className}>
         {children}
+        <Toaster position="top-right" />
       </body>
     </html>
   )