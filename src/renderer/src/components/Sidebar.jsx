import { useState } from 'react'
import { FaTh, FaBars } from 'react-icons/fa'
import { FaArrowRightArrowLeft, FaArrowRight, FaPeopleGroup } from 'react-icons/fa6'
import { TbRotate360 } from 'react-icons/tb'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)
    const menuItem = [
        {
            path: '/',
            name: 'Dashboard',
            icon: <FaTh />
        },
        {
            path: '/singlyLink',
            name: 'Single',
            icon: <FaArrowRight />
        },
        {
            path: '/doublyLink',
            name: 'Double',
            icon: <FaArrowRightArrowLeft />
        },
        {
            path: '/circular',
            name: 'Circular',
            icon: <TbRotate360 />
        },
        {
            path: '/groups',
            name: 'Groups',
            icon: <FaPeopleGroup />
        },
        {
            path: '/about',
            name: 'About',
            icon: <BsFillInfoCircleFill />
        }
    ]
    return (
        <div className="container">
            <div style={{ width: isOpen ? '200px' : '50px' }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
                        TJCS
                    </h1>
                    <div style={{ marginLeft: isOpen ? '50px' : '0px' }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeclassName="active">
                        <div className="icon">{item.icon}</div>
                        <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                            {item.name}
                        </div>
                    </NavLink>
                ))}
            </div>
            <main>{children}</main>
        </div>
    )
}

Sidebar.propTypes = {
    children: PropTypes.func.isRequired
}

export default Sidebar
