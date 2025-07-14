import UserProfile from "@/components/shared/UserProfile";
import ProtectedRoute from "../../../components/shared/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}
