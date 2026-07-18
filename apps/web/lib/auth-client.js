"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";

/**
 * Reads session state from GET /api/auth/me, which only succeeds if the
 * httpOnly cookie is present and its JWT still verifies server-side.
 * `retry: false` matters here — a 401 is an expected, meaningful answer
 * ("not logged in"), not a transient failure to retry.
 */
export function useSession() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.get("/auth/me").then((r) => r.data.user),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }) => api.post("/auth/login", { email, password }),
    onSuccess: () => {
      // The cookie is already set by the browser at this point (Set-Cookie
      // on the response) — just refresh the session query so the rest of
      // the admin UI picks up the logged-in state.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      router.push("/admin/login");
    },
  });
}
