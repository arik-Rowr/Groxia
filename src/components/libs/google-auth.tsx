"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

const API = process.env.NEXT_PUBLIC_APP_URL;

export default function GoogleAuthButton() {
  const router = useRouter();
  const { setUser, refreshUser } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          if (!credentialResponse.credential) {
            console.error("No credential received from Google");
            return;
          }

          // Send the Google credential to your Django backend
          const res = await axios.post(
            `${API}/api/users/google-login/`,
            {
              token: credentialResponse.credential,
            }
          );

          // Extract token and user from backend response
          const { token, user } = res.data;

          if (!token) {
            console.error("No token returned from backend");
            return;
          }

          // 1. Store token under the key expected by AuthContext
          localStorage.setItem("token", token);

          // 2. Update the user in context (and optionally persist)
          if (user) {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            // If no user object, fetch the full profile using the token
            await refreshUser();
          }

          // 3. Redirect to the desired page
          router.replace("/");
        } catch (error) {
          console.error("Google login error:", error);
        }
      }}
      onError={() => console.log("Google Login Failed")}
    />
  );
}