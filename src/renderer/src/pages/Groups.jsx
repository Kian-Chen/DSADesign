import { useEffect, useRef, useState } from 'react'
import { socialGraph } from '../common/graph'
import { Network } from 'vis-network'
import PropTypes from 'prop-types'
import '../css/Groups.css'
const Groups = ({ currentUserId }) => {
    const networkRef = useRef(null)
    const containerRef = useRef(null)
    const [friendId, setFriendId] = useState('')
    const [recommendations, setRecommendations] = useState([])

    useEffect(() => {
        renderGraph()
        loadRecommendations() // 加载推荐好友
    }, [currentUserId, friendId])

    const renderGraph = () => {
        const currentUser = socialGraph.getUserById(currentUserId)

        if (!currentUser) {
            console.error('User not found.')
            return
        }

        // 创建节点
        const nodes = [
            {
                id: currentUser.id,
                label: currentUser.name,
                color: '#FF5733',
                shape: 'dot',
                size: 20,
                font: { color: '#000000' }
            }
        ]

        const edges = []

        // 添加好友关系
        currentUser.friends.forEach((friendId) => {
            const friend = socialGraph.getUserById(friendId)
            if (friend) {
                nodes.push({
                    id: friend.id,
                    label: friend.name,
                    color: '#33FF57',
                    shape: 'dot',
                    size: 15,
                    font: { color: '#000000' }
                })

                // 构建边的关系标注
                const relationshipTypes = []

                if (currentUser.school === friend.school)
                    relationshipTypes.push(`School: ${currentUser.school}`)
                if (currentUser.location === friend.location)
                    relationshipTypes.push(`Location: ${currentUser.location}`)
                if (currentUser.groups.some((group) => friend.groups.includes(group)))
                    relationshipTypes.push(
                        `Group: ${currentUser.groups.find((group) => friend.groups.includes(group))}`
                    )
                if (currentUser.friends.includes(friendId)) relationshipTypes.push('Friend')

                const label = relationshipTypes.join('\n')

                edges.push({
                    from: currentUser.id,
                    to: friend.id,
                    label: '',
                    font: { align: 'middle', color: '#000000', background: '#ffffff' },
                    color: {
                        color: relationshipTypes.includes('School')
                            ? '#33A2FF'
                            : relationshipTypes.includes('Location')
                                ? '#33FF99'
                                : relationshipTypes.includes('Group')
                                    ? '#FF33E6'
                                    : '#33FF57',
                        highlight: '#FF5733',
                        hover: '#FF5733'
                    },
                    relationshipLabel: label // 保存关系标注，稍后在点击时显示
                })
            }
        })

        // 初始化网络图
        const data = { nodes, edges }
        const options = {
            interaction: { hover: true },
            nodes: {
                shape: 'dot',
                font: {
                    size: 16,
                    color: '#ffffff'
                }
            },
            edges: {
                width: 2
            },
            physics: {
                stabilization: false
            }
        }

        if (containerRef.current) {
            networkRef.current = new Network(containerRef.current, data, options)

            // 监听点击事件，显示或隐藏边的标注
            networkRef.current.on('click', function (params) {
                if (params.edges.length > 0) {
                    const edgeId = params.edges[0]
                    const edge = edges.find((edge) => edge.id === edgeId)
                    if (edge) {
                        edge.label = edge.label ? '' : edge.relationshipLabel
                        networkRef.current.setData({ nodes, edges })
                    }
                }
            })
        }
    }

    const loadRecommendations = () => {
        const maxRecommendations = 5
        const recommendations = socialGraph.getFriendRecommendations(
            currentUserId,
            maxRecommendations
        )
        setRecommendations(recommendations)
    }

    const handleAddFriend = () => {
        if (friendId && socialGraph.getUserById(friendId)) {
            socialGraph.addFriend(currentUserId, friendId)
            alert('好友添加成功！')
            setFriendId('') // 清空输入框
            loadRecommendations() // 更新推荐好友
        } else {
            alert('好友ID无效或不存在！')
        }
    }

    const handleRemoveFriend = () => {
        if (friendId && socialGraph.getUserById(friendId)) {
            socialGraph.removeFriend(currentUserId, friendId)
            alert('好友移除成功！')
            setFriendId('') // 清空输入框
            loadRecommendations() // 更新推荐好友
        } else {
            alert('好友ID无效或不存在！')
        }
    }

    return (
        <div className="groups-container">
            <div ref={containerRef} className="network-container"></div>
            <div className="controls-container">
                <h3 className="controls-title">Controls</h3>
                <input
                    type="text"
                    placeholder="Enter Friend ID"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleAddFriend} className="action-button add-button">
                    Add Friend
                </button>
                <button onClick={handleRemoveFriend} className="action-button remove-button">
                    Remove Friend
                </button>

                <h3 className="recommendations-title">Friend Recommendations</h3>
                {recommendations.length > 0 ? (
                    <ul className="recommendations-list">
                        {recommendations.map((rec) => (
                            <li key={rec.user.id} className="recommendation-item">
                                {rec.user.name} - Common Friends: {rec.commonFriendsCount}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommendations available</p>
                )}
            </div>
        </div>
    )
}

Groups.propTypes = {
    currentUserId: PropTypes.string.isRequired
}

export default Groups
