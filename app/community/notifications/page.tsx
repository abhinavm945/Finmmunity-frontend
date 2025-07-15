"use client";

import { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import ProtectedRoute from "../../../components/shared/ProtectedRoute";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { Bell, Check, Heart, MessageCircle, UserPlus } from "lucide-react";
import Avatar from "../../../components/shared/Avatar";
import { formatDate } from "../../../utils/formatDate";
import { Notification } from "@/types/community/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.community.notifications.getAll();
      if (response.success && response.data) {
        setNotifications(response.data as Notification[]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);
      const response = await api.community.markNotificationAsRead(
        notificationId
      );
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.community.markAllNotificationsAsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "like":
        return <Heart size={16} className="text-red-500" />;
      case "comment":
        return <MessageCircle size={16} className="text-blue-500" />;
      case "follow":
        return <UserPlus size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const username = notification.fromUsername || "Someone";
    switch (notification.type?.toLowerCase()) {
      case "like":
        return `${username} liked your ${
          notification.itemType?.toLowerCase() || "post"
        }`;
      case "comment":
        return `${username} commented on your ${
          notification.itemType?.toLowerCase() || "post"
        }`;
      case "follow":
        return `${username} started following you`;
      default:
        return notification.content || "You have a new notification";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAllAsRead}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {markingAllAsRead
                ? "Marking..."
                : `Mark all as read (${unreadCount})`}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Avatar
                        size="sm"
                        image={
                          notification.fromUser?.profilePicture ||
                          "/images/default-avatar.png"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getNotificationIcon(notification.type)}
                        <p className="text-sm text-gray-800">
                          {getNotificationText(notification)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>

                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            disabled={markingAsRead === notification.id}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            <Check size={12} />
                            {markingAsRead === notification.id
                              ? "Marking..."
                              : "Mark as read"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500">
                When you get notifications, they&apos;ll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
