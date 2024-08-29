import { socialGraph } from '../common/graph'
import PropTypes from 'prop-types'
import '../css/Dashboard.css'  // 引入 CSS 文件

const Dashboard = ({ currentUserId, setCurrentUserId }) => {
    const currentUser = socialGraph.getUserById(currentUserId)

    if (!currentUser) {
        return <div className="dashboard-error">User not found. Please select a valid user.</div>
    }

    const friendsList = currentUser.friends
        .map((friendId) => socialGraph.getUserById(friendId))
        .filter((friend) => friend)

    const handleUserChange = (event) => {
        const newUserId = event.target.value
        if (socialGraph.getUserById(newUserId)) {
            setCurrentUserId(newUserId)
        }
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="dashboard-info">
                <p>
                    <strong>Name:</strong> {currentUser.name}
                </p>
                <p>
                    <strong>Location:</strong> {currentUser.location}
                </p>
                <p>
                    <strong>Schools:</strong> {currentUser.schools.join(', ')}
                </p>
                <p>
                    <strong>Workplaces:</strong> {currentUser.workplaces.join(', ')}
                </p>
                <p>
                    <strong>Groups:</strong> {currentUser.groups.join(', ')}
                </p>
                <p>
                    <strong>Friends:</strong> {friendsList.map((friend) => friend.name).join(', ')}
                </p>
            </div>
            <div className="dashboard-switch-user">
                <label htmlFor="user-select">Switch User: </label>
                <select id="user-select" value={currentUserId} onChange={handleUserChange} className="dashboard-select">
                    {socialGraph.users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

Dashboard.propTypes = {
    currentUserId: PropTypes.string.isRequired,  // 修改为 string 类型
    setCurrentUserId: PropTypes.func.isRequired
}

export default Dashboard
