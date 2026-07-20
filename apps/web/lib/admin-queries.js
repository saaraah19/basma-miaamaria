"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";

const PROJECTS_KEY = ["admin", "projects"];
const SERVICES_KEY = ["admin", "services"];

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: () => api.get("/projects/admin/all").then((r) => r.data),
  });
}

// Single-project fetch, used when a row is expanded to manage its images.
// Goes through the public idOrSlug lookup — fine since it works by id too,
// and this is only ever called with a known project.id from the table.
export function useProjectQuery(id) {
  return useQuery({
    queryKey: ["admin", "project", id],
    queryFn: () => api.get(`/projects/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/projects", data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/projects/${id}`, data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useAddProjectImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, files }) => {
      const form = new FormData();
      files.forEach((f) => form.append("images", f));
      return api.post(`/projects/${projectId}/images`, form).then((r) => r.data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useDeleteProjectImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId }) => api.delete(`/projects/images/${imageId}`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useSetProjectImageCover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId }) => api.patch(`/projects/images/${imageId}/cover`),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useUpdateProjectImageAlt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, alt }) => api.patch(`/projects/images/${imageId}`, { alt }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useReorderProjectImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, updates }) =>
      api.patch(`/projects/${projectId}/images/reorder`, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "project", variables.projectId] });
    },
  });
}

export function useServicesQuery() {
  return useQuery({
    queryKey: SERVICES_KEY,
    queryFn: () => api.get("/services").then((r) => r.data),
  });
}

export function useServiceMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY });

  const create = useMutation({
    mutationFn: (data) => api.post("/services", data).then((r) => r.data),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data).then((r) => r.data),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: invalidate,
  });
  const reorder = useMutation({
    mutationFn: (updates) => api.patch("/services/reorder", updates),
    onSuccess: invalidate,
  });

  return { create, update, remove, reorder };
}

// ── Content ──────────────────────────────────────────────

export function useSectionQuery(section) {
  return useQuery({
    queryKey: ["admin", "content", section],
    queryFn: () => api.get(`/content/${section}`).then((r) => r.data),
  });
}

export function useUpdateContentBlock(section) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, styles }) =>
      api.put(`/content/${section}/${key}`, { value, styles }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", section] });
      // Public pages read this same section via ISR-tagged server fetches —
      // they'll pick up the change within the tag's revalidate window, but
      // there's no on-demand revalidateTag call from the client here (that
      // requires a signed request to a route handler). Worth adding once
      // this goes to production if instant reflection matters more than
      // the ~60s ISR window.
    },
  });
}

// ── Media ────────────────────────────────────────────────

export function useMediaQuery() {
  return useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => api.get("/media").then((r) => r.data),
  });
}

export function useMediaMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

  const upload = useMutation({
    mutationFn: (file) => {
      const form = new FormData();
      form.append("file", file);
      return api.post("/media/upload", form).then((r) => r.data);
    },
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`/media/${id}`),
    onSuccess: invalidate,
  });

  return { upload, remove };
}
// ── Messages & Devis ─────────────────────────────────────

export function useMessagesQuery() {
  return useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => api.get("/messages").then((r) => r.data),
  });
}

export function useDevisRequestsQuery() {
  return useQuery({
    queryKey: ["admin", "devis-requests"],
    queryFn: () => api.get("/devis-requests").then((r) => r.data),
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/messages/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });
}

export function useMarkDevisRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/devis-requests/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "devis-requests"] }),
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/messages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });
}

export function useDeleteDevisRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/devis-requests/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "devis-requests"] }),
  });
}