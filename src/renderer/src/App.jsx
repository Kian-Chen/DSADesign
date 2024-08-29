import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard.jsx'
import SinglyLinkPage from './pages/SinglyLinkPage.jsx'
import DoublyLinkPage from './pages/DoublyLinkPage.jsx'
import CircularPage from './pages/CircularPage.jsx'
import Groups from './pages/Groups.jsx'
import About from './pages/About.jsx'
import { useState, useEffect } from 'react'
import { socialGraph } from './common/graph'

const App = () => {
    const [currentUserId, setCurrentUserId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUserId = localStorage.getItem('currentUserId')
        if (savedUserId && socialGraph.getUserById(savedUserId)) {
            setCurrentUserId(savedUserId)
        } else {
            const defaultUserId = 'user1' // 假设默认用户的 ID 是 '1'
            if (socialGraph.getUserById(defaultUserId)) {
                setCurrentUserId(defaultUserId)
                localStorage.setItem('currentUserId', defaultUserId)
            } else {
                console.error('Default user not found.')
            }
        }
        setLoading(false)
    }, [])

    if (loading) {
        return <div>Loading...</div> // 在用户 ID 加载之前显示一个加载状态
    }

    return (
        <BrowserRouter>
            <Sidebar>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                currentUserId={currentUserId}
                                setCurrentUserId={setCurrentUserId}
                            />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard
                                currentUserId={currentUserId}
                                setCurrentUserId={setCurrentUserId}
                            />
                        }
                    />
                    <Route path="/singlyLink" element={<SinglyLinkPage />} />
                    <Route path="/doublyLink" element={<DoublyLinkPage />} />
                    <Route path="/circular" element={<CircularPage />} />
                    <Route
                        path="/groups"
                        element={
                            <Groups
                                currentUserId={currentUserId}
                                setCurrentUserId={setCurrentUserId}
                            />
                        }
                    />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Sidebar>
        </BrowserRouter>
    )
}

export default App
