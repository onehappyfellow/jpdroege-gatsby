import { languages } from "prismjs"


const en = ['test1', 'test2']
const ko = ['Ktest1', 'Ktest2']

return (
    <div>
        {en.map((s,i) => <p className="en right" style={"grid-row:"+i} data-row={i}>{s}</p>)}
        {ko.map((s,i) => <p className="ko left" style={"grid-row:"+i} data-row={i}>{s}</p>)}
    </div>
)