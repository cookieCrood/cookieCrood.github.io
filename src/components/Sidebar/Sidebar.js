import { useState } from 'react'
import './Sidebar.css'

function SidebarItem({ name, onClick, deleteFile }) {
    return <div className={"sidebar-item-container" + (window.currentFile === name ? " sidebar-item-container-active" : "")}
        onClick={ onClick }
    >
        <div className="sidebar-item">
            <span className="sidebar-item-icon">&lt;&gt;</span> { name }.java
            { name === "Main" ? <></> :
                <span
                    className="sidebar-item-delete"
                    onClick={ () => deleteFile(name) }
                >x</span>
            }
        </div>
    </div>
}

function AddFileButton({ addFile }) {
    const [isAdding, setIsAdding] = useState(false)
    const [content, setContent] = useState(<>&nbsp;<span className="sidebar-add-button-icon">+</span> Add File</>)

    const onKeyUp = (e) => {
        if (e.key !== "Enter") return
        const fileName = e.target.value

        addFile(fileName)
        setContent(<>&nbsp;<span className="sidebar-add-button-icon">+</span> Add File</>)
        setIsAdding(false)
    }

    const onClick = (e) => {
        if (isAdding) return
        
        setContent(<>
            <input
                className="sidebar-add-input"
                placeholder="File Name"
                name="add-file"
                autoComplete="off"
                onKeyUp={ onKeyUp }
            />
        </>)

        setIsAdding(true)
    }

    return <div className="sidebar-item-container">
        <div className="sidebar-add-button"
            onClick={ onClick }
        >
            { content }
        </div>
    </div>
}

function Sidebar({ files, openFile, addFile, deleteFile }) {
    const addFileThroughButton = (fileName) => {
        addFile(fileName)
        openFile(fileName)
    }
    return <div className="sidebar">
        {
            Object.entries(files).map(([name, data]) => 
                <SidebarItem
                    key={ name }
                    name={ name }
                    onClick={ () => openFile(name) }
                    deleteFile={ deleteFile }
                />
            )
        }
        <AddFileButton
            addFile={ addFileThroughButton }
        />
    </div>
}

export default Sidebar