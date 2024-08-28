import { useState, useEffect, useRef } from 'react'
import { Network, DataSet } from 'vis-network/standalone'

// 定义链表节点
class ListNode {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

// 定义单链表类
class SinglyLinkedList {
    constructor() {
        this.head = null
        this.length = 0
    }

    insert(value, position) {
        const newNode = new ListNode(value)
        if (position === 0 || !this.head) {
            newNode.next = this.head
            this.head = newNode
        } else {
            let current = this.head
            for (let i = 0; i < position - 1 && current.next; i++) {
                current = current.next
            }
            newNode.next = current.next
            current.next = newNode
        }
        this.length++
    }

    find(value) {
        let current = this.head
        let index = 0
        while (current) {
            if (current.value === value) return index
            current = current.next
            index++
        }
        return -1
    }

    remove(value) {
        if (!this.head) return

        if (this.head.value === value) {
            this.head = this.head.next
            this.length--
            return
        }

        let current = this.head
        while (current.next && current.next.value !== value) {
            current = current.next
        }
        if (current.next) {
            current.next = current.next.next
            this.length--
        }
    }

    toArray() {
        let arr = []
        let current = this.head
        while (current) {
            arr.push(current.value)
            current = current.next
        }
        return arr
    }
}

const SinglyLinkPage = () => {
    const [commands, setCommands] = useState([])
    const [insertValue, setInsertValue] = useState('')
    const [insertPosition, setInsertPosition] = useState(0)
    const [findValue, setFindValue] = useState('')
    const [removeValue, setRemoveValue] = useState('')
    const networkContainer = useRef(null)
    const list = useRef(new SinglyLinkedList())
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
        let id = 0
        let current = list.current.head
        let x = 0
        let y = 0
        let direction = 1

        while (current) {
            nodesData.current.add({
                id,
                label: `${current.value}`,
                shape: 'box',
                x: x * 100,
                y: y * 50
            })
            if (id > 0) {
                edgesData.current.add({ from: id - 1, to: id })
            }
            id++
            x += direction
            if (x % 2 === 0) {
                y += 1
                direction *= -1
            }
            current = current.next
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
                    enabled: true,
                    direction: 'LR', // 左右方向
                    sortMethod: 'directed'
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
        <div style={{ display: 'flex', height: '90vh' }}>
            <div style={{ flex: 1, padding: '10px', height: '100%' }}>
                <h1>Singly Linked List Visualization</h1>
                <div ref={networkContainer} style={{ height: '90%', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1, padding: '10px', height: '100%' }}>
                <h2>Commands</h2>

                <div style={{ marginBottom: '10px' }}>
                    <h3>Insert Node</h3>
                    <label htmlFor="insertValue">Value:</label>
                    <input
                        type="text"
                        id="insertValue"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                    <br></br>
                    <label htmlFor="insertPosition">Position:</label>
                    <input
                        type="number"
                        id="insertPosition"
                        value={insertPosition}
                        onChange={(e) => setInsertPosition(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                    <button onClick={handleInsert} style={{ marginLeft: '10px' }}>
                        Insert
                    </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <h3>Find Node</h3>
                    <label htmlFor="findValue">Value:</label>
                    <input
                        type="text"
                        id="findValue"
                        value={findValue}
                        onChange={(e) => setFindValue(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                    <button onClick={handleFind} style={{ marginLeft: '10px' }}>
                        Find
                    </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <h3>Remove Node</h3>
                    <label htmlFor="removeValue">Value:</label>
                    <input
                        type="text"
                        id="removeValue"
                        value={removeValue}
                        onChange={(e) => setRemoveValue(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                    <button onClick={handleRemove} style={{ marginLeft: '10px' }}>
                        Remove
                    </button>
                </div>

                <div>
                    <h3>Results</h3>
                    <p>{findResult}</p>
                    <p>{removeResult}</p>
                </div>

                <h2>Output</h2>
                <div style={{ maxHeight: '16vh', overflowY: 'auto' }}>
                    <pre>{JSON.stringify(output, null, 2)}</pre>
                </div>

                <h2>Command History</h2>
                <div style={{ maxHeight: '20vh', overflowY: 'auto' }}>
                    <ul>
                        {commands.map((cmd, index) => (
                            <li key={index}>{`${cmd.command}(${cmd.args.join(', ')})`}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SinglyLinkPage
