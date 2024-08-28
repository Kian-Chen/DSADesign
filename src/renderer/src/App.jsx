import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard.jsx'
import SinglyLinkPage from './pages/SinglyLinkPage.jsx'
import DoublyLinkPage from './pages/DoublyLinkPage.jsx'
import CircularPage from './pages/CircularPage.jsx'
import Groups from './pages/Groups.jsx'
import About from './pages/About.jsx'

const App = () => {
    return (
        <BrowserRouter>
            <Sidebar>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/singlyLink" element={<SinglyLinkPage />} />
                    <Route path="/doublyLink" element={<DoublyLinkPage />} />
                    <Route path="/circular" element={<CircularPage />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Sidebar>
        </BrowserRouter>
    )
}

export default App
