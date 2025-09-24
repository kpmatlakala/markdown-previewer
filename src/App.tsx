// src/App.jsx
import { useState } from 'react'
import { marked } from 'marked'
// import { Button } from 'delightplus-ui'

marked.setOptions({
  breaks: true,
})

function App() {
  const [markdown, setMarkdown] = useState(`# Hello Markdown!

Type some *Markdown* here, and see it rendered live!

## Features
- Live preview
- Headings, lists, code
- **Bold**, *italic*, \`inline code\`
  `)

  return (
    <div className="w-screen min-h-screen bg-gray-100 py-10 px-4">      
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Markdown Previewer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <textarea
            id="editor"
            className="w-full h-[70vh] p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />

          {/* Markdown Preview */}
          <div
            id="preview"
            className="w-full h-[70vh] overflow-y-auto p-4 border border-gray-300 bg-gray-50 rounded-md prose prose-sm md:prose-base lg:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(markdown) }}
          />
        </div>
      </div>
    </div>
  )
}

export default App
