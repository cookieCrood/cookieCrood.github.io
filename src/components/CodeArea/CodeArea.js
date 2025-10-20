import './CodeArea.css'
import { useEffect, useState } from 'react';
import * as shiki from 'shiki';
import darkFlat from '../../assets/night-flat.json'

const highlighter = await shiki.getSingletonHighlighter({ themes: [darkFlat], langs: ["java"] })

function CodeArea({ text, setFile, fileName }) {
    const [code, setCode] = useState(null)
    
    const onInput = e => {
        let content = e.target.innerHTML
        content = content.replace(/<div>(.*?)<\/div>/gs, "\n$1")
        content = content.replace(/<br\s*\/?>/gi, "")

        content = content.replaceAll('&lt;', '<').replaceAll('&gt;', '>')

        setCode(highlighter.codeToHtml(content, { theme: darkFlat, lang: "java" }))
        setFile(fileName, content)
    }

    const onKeyDown = e => {
        if (e.keyCode === 9) {
            e.preventDefault()
            const sel = document.getSelection()
            const range = sel.getRangeAt(0)
            const tabNode = document.createTextNode("    ")
            range.insertNode(tabNode)
            range.setStartAfter(tabNode)
            range.setEndAfter(tabNode)
            sel.removeAllRanges()
            sel.addRange(range)
        }
        onInput({ target: { innerHTML: e.target.innerHTML } })
    }

    const onCopy = (e) => {
        e.preventDefault()
        const selection = document.getSelection()
        const text = selection.toString()
        e.clipboardData.setData("text/plain", text)
    };

    const onPaste = (e) => {
        e.preventDefault()
        const text = e.clipboardData.getData("text/plain")

        const selection = window.getSelection()
        if (!selection.rangeCount) return
        selection.deleteFromDocument()
        selection.getRangeAt(0).insertNode(document.createTextNode(text))
        selection.collapseToEnd()

        onInput({ target: { innerHTML: e.target.innerHTML } })
    };

    useEffect(() => {
        if (!text) return 
        setCode(highlighter.codeToHtml(text, { theme: darkFlat, lang: "java" }))
    }, [text, setFile, fileName])

    return <div
        className="code-area-container"
    >
        <pre
            contentEditable={ true }
            spellCheck={ false }
            className="code-area-input code-area"
            onKeyDown={ onKeyDown }
            onInput={ onInput }
            onCopy={ onCopy }
            onPaste={ onPaste }
        >{ text }</pre>

        <pre
            className="code-area-display code-area shiki-container"
            dangerouslySetInnerHTML={{ __html: code }}
        />
    </div>
}

export default CodeArea