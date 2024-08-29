// common/graph.js
import { data } from './data'

class SocialGraph {
    constructor() {
        this.users = data.users
        this.groups = data.groups
        this.friendships = data.friendships
    }

    getUserById(userId) {
        return this.users.find((user) => user.id === userId)
    }

    getUserFriends(userId) {
        const user = this.getUserById(userId)
        return user ? user.friends.map((friendId) => this.getUserById(friendId)) : []
    }

    addFriend(userId, friendId) {
        const user = this.getUserById(userId)
        const friend = this.getUserById(friendId)
        if (user && friend) {
            if (!user.friends.includes(friendId)) {
                user.friends.push(friendId)
            }
            if (!friend.friends.includes(userId)) {
                friend.friends.push(userId)
            }
            this.saveToLocalStorage()
        }
    }

    removeFriend(userId, friendId) {
        const user = this.getUserById(userId)
        const friend = this.getUserById(friendId)
        if (user && friend) {
            user.friends = user.friends.filter((fid) => fid !== friendId)
            friend.friends = friend.friends.filter((fid) => fid !== userId)
            this.saveToLocalStorage()
        }
    }

    getGroupMembers(groupId) {
        return this.groups[groupId]
            ? this.groups[groupId].map((userId) => this.getUserById(userId))
            : []
    }

    saveToLocalStorage() {
        localStorage.setItem(
            'socialGraph',
            JSON.stringify({
                users: this.users,
                groups: this.groups,
                friendships: this.friendships
            })
        )
    }

    loadFromLocalStorage() {
        const savedData = JSON.parse(localStorage.getItem('socialGraph'))
        if (savedData) {
            this.users = savedData.users || this.users
            this.groups = savedData.groups || this.groups
            this.friendships = savedData.friendships || this.friendships
        }
    }

    // 获取推荐的好友，参数 maxCount 指定最大推荐人数
    getFriendRecommendations(userId, maxCount = 5) {
        const userFriends = new Set(this.getUserFriends(userId).map(friend => friend.id))
        const recommendations = []

        this.users.forEach(otherUser => {
            if (otherUser.id !== userId && !userFriends.has(otherUser.id)) {
                const commonFriends = this.getUserFriends(otherUser.id).filter(friend =>
                    userFriends.has(friend.id)
                )
                if (commonFriends.length > 0) {
                    recommendations.push({
                        user: otherUser,
                        commonFriendsCount: commonFriends.length
                    })
                }
            }
        })

        // 按共同好友数量排序，并限制推荐数量
        return recommendations
            .sort((a, b) => b.commonFriendsCount - a.commonFriendsCount)
            .slice(0, maxCount)
    }
}

export const socialGraph = new SocialGraph()
