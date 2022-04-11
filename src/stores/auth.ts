import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { browser } from "$app/env";
import { userStore } from "./user";
import { get } from "$lib/request-utils";

export interface JwtDto {
  sub: string
  iss: string
  cognito: string
  origin_jti: string
  aud: string
  event_id: string
  token_use: string
  auth_time: number
  exp: number
  iat: number
  jti: string
  email: string
}

export type Auth = {
  jwtToken: string
  username: string
}

let storedUser: string;
let authStore: Writable<Auth> = writable(null);

(async () => {
  if (browser) {
    storedUser = localStorage.getItem('auth');
    if (storedUser) {
      const parsedStoredUser = JSON.parse(storedUser);
      const decodedJwtToken: JwtDto = jwtDecode(parsedStoredUser.jwtToken);
      if (dayjs().unix() >= decodedJwtToken.exp) {
        localStorage.removeItem('auth');
      } else {
        authStore = writable<Auth>(parsedStoredUser);
        await getUser();
      }
    }
    authStore.subscribe((value: Auth) => {
      if (value) localStorage.setItem('auth', JSON.stringify(value));
      else localStorage.removeItem('auth');
    });
  }
})();

async function getUser() {
  const reponse = await get(`http://localhost:4000/api/users/me`);
  userStore.update(u => ({
    ...u,
    userId: reponse.data.id,
    avatar: reponse.data.avatar,
    username: reponse.data.username,
  }));
}

export { authStore } 
