import { writable } from "svelte/store";

export interface User {
  userId: number,
  username: string
  avatar: string
  profileTab: string
}

let userStore = writable<User>({
  userId: null,
  username: null,
  avatar: 'https://umcs-webdev-bucket.s3.eu-central-1.amazonaws.com/avatars/default.jpeg',
  profileTab: 'pictures',
});

export { userStore }