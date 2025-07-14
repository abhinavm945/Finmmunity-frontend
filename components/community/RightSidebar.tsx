"use client";

import { useCommunityData } from "../../hooks/useData";
import { User } from "../../utils/types";
import Avatar from "../shared/Avatar";
import LoadingSpinner from "../shared/LoadingSpinner";
import EmptyState from "../shared/EmptyState";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RightSidebar() {
  const router = useRouter();
  const { suggestedUsers } = useCommunityData();

  const handleFollow = async (userId: string) => {
    // This would typically call the follow API
    console.log("Follow user:", userId);
  };

  const handleDiscoverPeople = () => {
    router.push("/community/discover");
  };

  if (suggestedUsers.loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (suggestedUsers.error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <EmptyState type="error" onAction={() => suggestedUsers.fetch()} />
      </div>
    );
  }

  if (!suggestedUsers.data?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <EmptyState type="suggestedUsers" onAction={handleDiscoverPeople} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Suggested People</h3>
      <div className="space-y-3">
        {suggestedUsers.data.slice(0, 5).map((user: User) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                image={user.profilePicture}
                altText={user.username}
                size="sm"
              />
              <div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">
                  {user.followers?.length || 0} followers
                </p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user.id)}
              className="flex items-center px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Follow
            </button>
          </div>
        ))}
      </div>
      {suggestedUsers.data.length > 5 && (
        <button
          onClick={handleDiscoverPeople}
          className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          See more suggestions
        </button>
      )}
    </div>
  );
}
