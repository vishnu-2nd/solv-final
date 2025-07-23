@@ .. @@
 import StarterKit from '@tiptap/starter-kit'
 import Image from '@tiptap/extension-image'
 import Link from '@tiptap/extension-link'
 import TextAlign from '@tiptap/extension-text-align'
 import Underline from '@tiptap/extension-underline'
 import TextStyle from '@tiptap/extension-text-style'
 import Color from '@tiptap/extension-color'
 import Highlight from '@tiptap/extension-highlight'
+import FontFamily from '@tiptap/extension-font-family'
 import { Button } from './ui/Button'
 import { 
   Bold, 
   Italic, 
   Underline as UnderlineIcon, 
   Strikethrough, 
   Code, 
   List, 
   ListOrdered,
   Quote,
   Undo,
   Redo,
   AlignLeft,
   AlignCenter,
   AlignRight,
   Image as ImageIcon,
-  Link as LinkIcon
+  Link as LinkIcon,
+  Heading1,
+  Heading2,
+  Heading3,
+  Type,
+  ChevronDown
 } from 'lucide-react'
 import { useCallback, useState } from 'react'
 import toast from 'react-hot-toast'
@@ .. @@
 }) => {
   const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
   const [linkUrl, setLinkUrl] = useState('')
+  const [showFontDropdown, setShowFontDropdown] = useState(false)
+
+  const fontFamilies = [
+    { name: 'Default', value: '' },
+    { name: 'Arial', value: 'Arial, sans-serif' },
+    { name: 'Times New Roman', value: 'Times New Roman, serif' },
+    { name: 'Georgia', value: 'Georgia, serif' },
+    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
+    { name: 'Courier New', value: 'Courier New, monospace' },
+  ]
 
   const editor = useEditor({
     extensions: [
@@ -42,6 +58,9 @@
       Highlight.configure({
         multicolor: true,
       }),
+      FontFamily.configure({
+        types: ['textStyle'],
+      }),
     ],
     content,
     onUpdate: ({ editor }) => {
@@ .. @@
     setIsLinkModalOpen(false)
     setLinkUrl('')
   }, [editor, linkUrl])
+
+  const setFontFamily = useCallback((fontFamily: string) => {
+    if (editor) {
+      if (fontFamily === '') {
+        editor.chain().focus().unsetFontFamily().run()
+      } else {
+        editor.chain().focus().setFontFamily(fontFamily).run()
+      }
+      setShowFontDropdown(false)
+    }
+  }, [editor])
+
+  const getCurrentFontFamily = () => {
+    if (!editor) return 'Default'
+    const currentFont = editor.getAttributes('textStyle').fontFamily
+    const font = fontFamilies.find(f => f.value === currentFont)
+    return font ? font.name : 'Default'
+  }
 
   if (!editor) {
     return null
@@ .. @@
   return (
     <div className="border border-slate-300 rounded-lg overflow-hidden">
       {/* Toolbar */}
       <div className="border-b border-slate-300 p-2 flex flex-wrap gap-1 bg-slate-50">
+        {/* Headings */}
+        <ToolbarButton
+          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
+          isActive={editor.isActive('heading', { level: 1 })}
+          title="Heading 1"
+        >
+          <Heading1 className="w-4 h-4" />
+        </ToolbarButton>
+        
+        <ToolbarButton
+          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
+          isActive={editor.isActive('heading', { level: 2 })}
+          title="Heading 2"
+        >
+          <Heading2 className="w-4 h-4" />
+        </ToolbarButton>
+        
+        <ToolbarButton
+          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
+          isActive={editor.isActive('heading', { level: 3 })}
+          title="Heading 3"
+        >
+          <Heading3 className="w-4 h-4" />
+        </ToolbarButton>
+
+        <div className="w-px h-6 bg-slate-300 mx-1" />
+
+        {/* Font Family Dropdown */}
+        <div className="relative">
+          <button
+            type="button"
+            onClick={() => setShowFontDropdown(!showFontDropdown)}
+            className="flex items-center space-x-1 p-2 rounded hover:bg-slate-100 transition-colors text-slate-600 text-sm"
+            title="Font Family"
+          >
+            <Type className="w-4 h-4" />
+            <span className="hidden sm:inline">{getCurrentFontFamily()}</span>
+            <ChevronDown className="w-3 h-3" />
+          </button>
+          
+          {showFontDropdown && (
+            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-10 min-w-[150px]">
+              {fontFamilies.map((font) => (
+                <button
+                  key={font.name}
+                  type="button"
+                  onClick={() => setFontFamily(font.value)}
+                  className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
+                  style={{ fontFamily: font.value || 'inherit' }}
+                >
+                  {font.name}
+                </button>
+              ))}
+            </div>
+          )}
+        </div>

+        <div className="w-px h-6 bg-slate-300 mx-1" />
+        
         <ToolbarButton
           onClick={() => editor.chain().focus().toggleBold().run()}
           isActive={editor.isActive('bold')}
           title="Bold"
@@ .. @@
           </div>
         </div>
       )}
+
+      {/* Click outside to close font dropdown */}
+      {showFontDropdown && (
+        <div 
+          className="fixed inset-0 z-5" 
+          onClick={() => setShowFontDropdown(false)}
+        />
+      )}
     </div>
   )
 }