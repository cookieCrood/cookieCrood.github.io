import FileManager from '../../classes/FileManager'
import './Diagram.css'

function extractCode(code) {
    const parameterRegex = /([A-Za-z_][A-Za-z0-9_<>\[\]]*)\s+([A-Za-z_][A-Za-z0-9_]*)/g

    const nameRegex = /^public\s+class\s+([A-Z][A-Za-z0-9_]*)\s*\{/m
    const nameMatch = code.match(nameRegex)

    const name = nameMatch ? nameMatch[1] : "ERROR"



    const fieldRegex = /(public|private)\s+([A-Za-z_][A-Za-z0-9_<>\[\]]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(=\s*[^;]+)?\s*;/g
    const fieldMatch = code.matchAll(fieldRegex)

    const fields = []
    for (const m of fieldMatch) {
        fields.push({
            modifier: m[1],
            type: m[2],
            name: m[3]
        })
    }



    const constructorRegex = new RegExp(
        `public\\s+${name}\\s*\\(([^)]*)\\)\\s*\\{[\\s\\S]*?\\}`,
        "g"
    )
    const constructorMatch = code.matchAll(constructorRegex)

    const constructors = []
    for (const m of constructorMatch) {
        const parameters = []
        const parameterMatch = m[1].matchAll(parameterRegex)

        for (const p of parameterMatch) {
            parameters.push({
                type: p[1],
                name: p[2]
            })
        }
        
        constructors.push({
            name,
            parameters
        })
    }



    const methodRegex = /(public|private|protected)\s+([A-Za-z_][A-Za-z0-9_<>\[\]]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*\{[\s\S]*?\}/g
    const methodMatch = code.matchAll(methodRegex)

    const methods = []
    for (const m of methodMatch) {
        const parameters = []
        const parameterMatch = m[4].matchAll(parameterRegex)

        for (const p of parameterMatch) {
            parameters.push({
                type: p[1],
                name: p[2]
            })
        }
        
        methods.push({
            modifier: m[1],
            returnType: m[2],
            name: m[3],
            parameters
        })
    }


    return <Table
        name={ name }
        fields={ fields }
        constructors={ constructors }
        methods={ methods }
    />
}

function Table({ name, fields, constructors, methods }) {
    console.log(methods)
    function TableName({ name }) {
        return <div className="diagram-table-name">
            { name }
        </div>
    }

    function TableField({ field }) {
        return <div className="diagram-table-field">
            <span
                className={ field.modifier === "public" ? "diagram-table-public" : "diagram-table-private"}
            >
                {
                    field.modifier === "public"
                    ? "+"
                    : "-"
                }
            </span>
            
            {" " + field.name }:

            <span
                className="diagram-table-type"
            >
                {" " + field.type }
            </span>
        </div>
    }

    function Constructor({ constructor }) {
        return <div className="diagram-table-constructor">
            <span
                className="diagram-table-public"
            >
                +
            </span>
            {" " + constructor.name }{"("}
            {
                constructor.parameters.map((p, i) => <>
                    <span className="diagram-table-type">
                        { p.type }
                    </span>
                    {
                        i === constructor.parameters.length - 1 ? "" : ", "
                    }
                </>)
            }
            {")"}
        </div>
    }

    function Method({ method }) {
        return <div className="diagram-table-method">
            <span
                className={ method.modifier === "public" ? "diagram-table-public" : "diagram-table-private"}
            >
                {
                    method.modifier === "public"
                    ? "+"
                    : "-"
                }
            </span>
            {" "}
            { method.name }{"("}
            {
                method.parameters.map((p, i) => <>
                    <span className="diagram-table-type">
                        { p.type }
                    </span>
                    {
                        i === method.parameters.length - 1 ? "" : ", "
                    }
                </>)
            }
            {")"}
            {": "}<span className="diagram-table-type">
                { method.returnType }
            </span>
        </div>
    }

    return <div className="diagram-table">
        <TableName name={ name } />
        <hr />
        <div className="diagram-table-fields">
            {
                fields.map((field, i) => <TableField key={i} field={ field } />)
            }
        </div>
        <hr />
        <div className="diagram-table-constructors">
            {
                constructors.map((constructor, i) => <Constructor key={i} constructor={ constructor }/>)
            }
        </div>
        <hr />
        <div className="diagram-table-methods">
            {
                methods.map((method, i) => <Method key={i} method={ method }/>)
            }
        </div>
    </div>
}

function Diagram() {
    const files = FileManager.getFiles()

    return <div className="diagram">
        {
            Object.entries(files).map(([name, data]) => extractCode(data))
        }
    </div>
}

export default Diagram