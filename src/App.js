import './App.css'
import CodeArea from './components/CodeArea/CodeArea'
import Sidebar from './components/Sidebar/Sidebar'
import FileManager from './classes/FileManager'
import Diagram from './components/Diagram/Diagram'

import { useEffect, useState } from 'react'

function Code() {
    const [currentFile, setCurrentFile] = useState("")
    const [currentFileName, setCurrentFileName] = useState("")

    const addFile = (fileName) => {
        FileManager.addFile(fileName)
    }
    const openFile = (fileName) => {
        if (!FileManager.getFile(fileName)) fileName = "Main"

        setCurrentFileName(fileName)
        setCurrentFile(FileManager.getFile(fileName))
    }
    const setFile = (fileName, data) => {
        FileManager.setFile(fileName, data)
    }
    const deleteFile = (fileName) => {
        FileManager.deleteFile(fileName)

        openFile()
    }

    useEffect(() => {
        openFile()
    }, [])

    return <>
        <Sidebar
            openFile={ openFile }
            addFile={ addFile }
            deleteFile={ deleteFile }
            files={ FileManager.getFiles() }
        />
        <CodeArea
            text={ currentFile }
            fileName={ currentFileName }
            setFile={ setFile }
        />
    </>
}

function App() {
    const [currentWindow, setCurrentWindow] = useState(<Code />)
    const [currentWindowName, setCurrentWindowName] = useState("code")

    const showCode = () => {
        if (currentWindowName === "code") return

        setCurrentWindow(<Code />)
        setCurrentWindowName("code")
    }

    const showDiagram = () => {
        if (currentWindowName === "diagram") return

        setCurrentWindow(<Diagram />)
        setCurrentWindowName("diagram")
    }

    return <><div className="left">
        <div className="window-button-container">
            <div
                className={ "window-button code-button" + (currentWindowName === "code" ? " window-button-active" : "") }
                onClick={ () => showCode() }
            >
                {"<>"}
            </div>
            <div
                className={ "window-button diagram-button"  + (currentWindowName === "diagram" ? " window-button-active" : "") }
                onClick={ () => showDiagram() }
            >
                {"D"}
            </div>
        </div>
        
    </div>
        { currentWindow }
    </>
}

export default App;
