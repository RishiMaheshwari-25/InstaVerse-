import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users",
  withCredentials: true,
});

export async function getMyProfile() {
  const response = await api.get("/me");
  return response.data;
}

export async function updateMyProfile(details) {
  const response = await api.patch("/me", details);
  return response.data;
}

export async function uploadProfileImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await api.patch("/me/image", formData);
  return response.data;
}

export async function getDiscoverUsers() {
  const response = await api.get("/discover");
  return response.data;
}

export async function getConnections(type) {
  const response = await api.get(`/connections?type=${type}`);
  return response.data;
}

export async function followUser(username) {
  const response = await api.post(`/follow/${username}`);
  return response.data;
}

export async function unfollowUser(username) {
  const response = await api.delete(`/unfollow/${username}`);
  return response.data;
}
