// src/hooks/useAuth.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const AUTH_QUERY_KEY = "auth";

// Define the JWT Payload structure
interface JwtPayload {
  exp: number; // expiration time in seconds
}

export const initializeAuth = () => {
  let token: string | null | undefined = Cookies.get("_UPLFMMATRIX");
  let user: string | null | undefined = Cookies.get("user");

  // Check for invalid user data format and clear if found
  if (user === "[object Object]") {
    console.error("Invalid user data format detected, clearing cookies");
    Cookies.remove("_UPLFMMATRIX");
    Cookies.remove("user");
    return null;
  }

  // Check if token exists
  if (token && user) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Convert expiration time from seconds to milliseconds
      const expirationDate = dayjs.unix(decoded.exp);

      // Get the current time
      const currentDate = dayjs();

      // Calculate the time left before expiration (in seconds)
      const timeLeft = expirationDate.diff(currentDate, "second");

      // If token is expired, clear both token and user
      if (timeLeft <= 0) {
        token = null;
        user = null;
        // Optionally, remove the cookies as well:
        Cookies.remove("_UPLFMMATRIX");
        Cookies.remove("user");
      }
    } catch (_error) {
      // In case the token is invalid or decoding fails
      token = null;
      user = null;
      Cookies.remove("_UPLFMMATRIX");
      Cookies.remove("user");
    }
  }

  // Return token and user if valid, otherwise return null
  return token && user ? { token, user } : null;
};

export const useAuth = () => {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: () => initializeAuth(),
    staleTime: Infinity,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    Cookies.remove("_UPLFMMATRIX");
    window.location.reload();
    queryClient.removeQueries({ queryKey: [AUTH_QUERY_KEY] });
  };
};
