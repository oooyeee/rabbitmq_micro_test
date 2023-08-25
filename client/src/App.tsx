import { useCallback, useRef, useState } from 'react'
import styles from "./App.module.sass"

function App() {
    const Block = () => {
        let [text, setText] = useState<string | null>(null)

        const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (ev) => {
            setText("Loading (15s max) ...")
            try {
                let request = await fetch(
                    "http://localhost:9091/requests", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "description": "dummy description " + window.crypto.randomUUID().substring(0, 8)
                    })
                });

                let result = await request.json()
                console.log(result);
                result = JSON.stringify(result, null, 4)
                setText(result)
            } catch (err: any) {
                console.log(err)
                setText(err?.message ?? "error :(")
            }
        }, []);


        return (
            <div>
                <button onClick={(ev) => { onClick(ev)}}>send request</button>
                <pre className={styles.Result}>{text}</pre>
            </div>
        )
    }

    return (
        <div className={styles.App}>
            <h1>Test requests</h1>
            <div className={styles.Buttons}>
                {Array(4).fill(null).map((el, idx) => <Block key={idx} />)}
            </div>
        </div>
    )
}

export default App
