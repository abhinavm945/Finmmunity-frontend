'use client';

import { useState } from 'react';
import Avatar from '../shared/Avatar';
import { demoUsers } from '../../utils/demoData';
import Link from 'next/link';

export default function RightSidebar() {
  const currentUser = demoUsers[0];
  const suggestedUsers = demoUsers.filter((user) => user._id !== currentUser._id);

  return (
    <div className="p-4 bg-white border-l border-gray-200 h-screen">
      <h3 className="text-lg font-semibold mb-4">Suggested Users</h3>
      <div className="space-y-4">
        {suggestedUsers.map((user) => {
          const [isFollowing, setIsFollowing] = useState(
            currentUser.following.includes(user._id)
          );

          const handleFollowOrUnfollow = () => {
            setIsFollowing(!isFollowing);
            if (isFollowing) {
              currentUser.following = currentUser.following.filter((id) => id !== user._id);
              user.followers = user.followers.filter((id) => id !== currentUser._id);
            } else {
              currentUser.following.push(user._id);
              user.followers.push(currentUser._id);
            }
          };

          return (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar size="xs" image={user.profilePicture} />
                <Link href={`/profile/${user._id}`}>
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>
              </div>
              <button
                onClick={handleFollowOrUnfollow}
                className={`text-sm ${
                  isFollowing
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}