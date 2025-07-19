"use client";

import EditProfile from "../../../components/shared/EditProfile";
// import { useSearchParams } from "next/navigation";

export default function EditProfilePage() {
  // const searchParams = useSearchParams();
  // const userId = searchParams.get("id");

  return (
    <div className="max-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <EditProfile />
      </div>
    </div>
  );
}
