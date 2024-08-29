import { useState, useEffect, useRef } from 'react'
import { Network, DataSet } from 'vis-network/standalone'
import '../css/SinglyLinkPage.css'


// 定义循环链表节点
class CircularListNode {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

// 定义循环链表类
class CircularSinglyLinkedList {
    constructor() {
        this.head = null
        this.length = 0
    }

    insert(value, position) {
        const newNode = new CircularListNode(value)
        if (position === 0 || !this.head) {
            newNode.next = this.head
            if (this.head) {
                let current = this.head
                while (current.next !== this.head) {
                    current = current.next
                }
                current.next = newNode
            } else {
                newNode.next = newNode
            }
            this.head = newNode
        } else {
            let current = this.head
            let count = 0
            while (count < position - 1 && current.next !== this.head) {
                current = current.next
                count++
            }
            newNode.next = current.next
            current.next = newNode
        }
        this.length++
    }

    find(value) {
        let current = this.head
        let index = 0
        if (!current) return -1
        do {
            if (current.value === value) return index
            current = current.next
            index++
        } while (current !== this.head)
        return -1
    }

    remove(value) {
        if (!this.head) return

        if (this.head.value === value) {
            let current = this.head
            while (current.next !== this.head) {
                current = current.next
            }
            current.next = this.head.next
            this.head = this.head.next
            this.length--
            return
        }

        let current = this.head
        let prev = null
        while (current.next !== this.head && current.value !== value) {
            prev = current
            current = current.next
        }
        if (current.value === value) {
            prev.next = current.next
            this.length--
        }
    }

    toArray() {
        let arr = []
        let current = this.head
        if (!current) return arr
        do {
            arr.push(current.value)
            current = current.next
        } while (current !== this.head)
        return arr
    }
}

const CircularPage = () => {
    const [commands, setCommands] = useState([])
    const [insertValue, setInsertValue] = useState('')
    const [insertPosition, setInsertPosition] = useState(0)
    const [findValue, setFindValue] = useState('')
    const [removeValue, setRemoveValue] = useState('')
    const networkContainer = useRef(null)
    const list = useRef(new CircularSinglyLinkedList())
    const nodesData = useRef(new DataSet())
    const edgesData = useRef(new DataSet())
    const networkRef = useRef(null)
    const [output, setOutput] = useState([])
    const [findResult, setFindResult] = useState('')
    const [removeResult, setRemoveResult] = useState('')

    // 更新网络图
    const updateNetwork = () => {
        nodesData.current.clear()
        edgesData.current.clear()

        const radius = 200 // 圆的半径
        const center = { x: 400, y: 300 } // 圆心位置
        const angleStep = (Math.PI * 2) / list.current.length // 每个节点之间的角度差

        let id = 0
        let current = list.current.head

        while (current) {
            const angle = id * angleStep
            const x = center.x + radius * Math.cos(angle)
            const y = center.y + radius * Math.sin(angle)

            nodesData.current.add({
                id,
                label: `${current.value}`,
                shape: 'box',
                x,
                y
            })

            if (id > 0) {
                edgesData.current.add({ from: id - 1, to: id })
            }
            if (id === 0 && list.current.length > 1) {
                edgesData.current.add({ from: list.current.length - 1, to: 0 }) // 连接最后一个节点到第一个节点
            }

            id++
            current = current.next
            if (current === list.current.head) break
        }

        if (networkRef.current) {
            networkRef.current.setData({
                nodes: nodesData.current,
                edges: edgesData.current
            })
            networkRef.current.redraw() // 确保网络图重新绘制
        }
    }

    useEffect(() => {
        // 初始化网络图
        const options = {
            layout: {
                hierarchical: {
                    enabled: false // 禁用层级布局
                }
            },
            nodes: {
                shape: 'box',
                font: {
                    size: 16
                },
                widthConstraint: {
                    minimum: 50,
                    maximum: 100
                },
                heightConstraint: {
                    minimum: 50,
                    maximum: 100
                }
            },
            edges: {
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.5
                    }
                }
            }
        }

        networkRef.current = new Network(
            networkContainer.current,
            {
                nodes: nodesData.current,
                edges: edgesData.current
            },
            options
        )

        updateNetwork()

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy()
            }
        }
    }, [])

    useEffect(() => {
        updateNetwork()
    }, [list.current])

    const handleInsert = () => {
        try {
            list.current.insert(insertValue, parseInt(insertPosition))
            setCommands([...commands, { command: 'insert', args: [insertValue, insertPosition] }])
            setOutput(list.current.toArray())
            updateNetwork() // 立即更新网络图
        } catch (error) {
            console.error(error)
        }
    }

    const handleFind = () => {
        try {
            const foundIndex = list.current.find(findValue)
            if (foundIndex === -1) {
                setFindResult(`Element ${findValue} not found.`)
            } else {
                setFindResult(`Element ${findValue} found at position: ${foundIndex}`)
            }
            setCommands([...commands, { command: 'find', args: [findValue] }])
            setOutput(list.current.toArray())
            updateNetwork() // 立即更新网络图
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemove = () => {
        try {
            const foundIndex = list.current.find(removeValue)
            if (foundIndex === -1) {
                setRemoveResult(`Element ${removeValue} not found.`)
            } else {
                list.current.remove(removeValue)
                setRemoveResult(`Element ${removeValue} removed at position: ${foundIndex}`)
            }
            setCommands([...commands, { command: 'remove', args: [removeValue] }])
            setOutput(list.current.toArray())
            updateNetwork() // 立即更新网络图
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="container">
            <div className="network-container" ref={networkContainer} />
            <div className="controls">
                <h1>Circular Linked List Visualization</h1>

                <div className="control-group">
                    <h3>Insert Node</h3>
                    <label htmlFor="insertValue">Value:</label>
                    <input
                        type="text"
                        id="insertValue"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                    />
                    <label htmlFor="insertPosition">Position:</label>
                    <input
                        type="number"
                        id="insertPosition"
                        value={insertPosition}
                        onChange={(e) => setInsertPosition(e.target.value)}
                    />
                    <button onClick={handleInsert}>Insert</button>
                </div>

                <div className="control-group">
                    <h3>Find Node</h3>
                    <label htmlFor="findValue">Value:</label>
                    <input
                        type="text"
                        id="findValue"
                        value={findValue}
                        onChange={(e) => setFindValue(e.target.value)}
                    />
                    <button onClick={handleFind}>Find</button>
                </div>

                <div className="control-group">
                    <h3>Remove Node</h3>
                    <label htmlFor="removeValue">Value:</label>
                    <input
                        type="text"
                        id="removeValue"
                        value={removeValue}
                        onChange={(e) => setRemoveValue(e.target.value)}
                    />
                    <button onClick={handleRemove}>Remove</button>
                </div>

                <div className="results">
                    <h3>Results</h3>
                    <p>{findResult}</p>
                    <p>{removeResult}</p>
                </div>

                <h2>Output</h2>
                <div className="output">
                    <pre>{JSON.stringify(output, null, 2)}</pre>
                </div>

                <h2>Command History</h2>
                <div className="command-history">
                    <ul>
                        {commands.map((cmd, index) => (
                            <li key={index}>{`${cmd.command}(${cmd.args.join(', ')})`}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CircularPage
