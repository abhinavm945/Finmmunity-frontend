"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../../store";
import { loginUser } from "../../store/slices/authSlice";

export default function DemoLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleDemoLogin = async () => {
    try {
      // Use demo credentials that will trigger fallback data
      const result = await dispatch(
        loginUser({
          email: "demo@finmunity.com",
          password: "demo123",
        })
      );

      if (loginUser.fulfilled.match(result)) {
        const userId = result.payload?.user?.id;
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          if (userId) {
            router.push(`/?id=${userId}`);
          } else {
            router.push("/");
          }
        }, 100);
      }
    } catch (error) {
      console.error("Demo login error:", error);
    }
  };

  return (
    <button
      onClick={handleDemoLogin}
      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
    >
      Demo Login
    </button>
  );
}
