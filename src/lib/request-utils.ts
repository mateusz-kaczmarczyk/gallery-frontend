import { authStore } from '$stores/auth'
import { goto } from "$app/navigation";
import { get as getStore } from "svelte/store";

export async function post(url: string, body: any) {
  try {
    let headers = {};
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
    const store = getStore(authStore);
    if (store && store.jwtToken) {
      headers['Authorization'] = `Bearer ${store.jwtToken}`;
    }
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return result.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function patch(url: string, body: any) {
  try {
    let headers = {};
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
    const store = getStore(authStore);
    if (store && store.jwtToken) {
      headers['Authorization'] = `Bearer ${store.jwtToken}`;
    }
    const result = await fetch(url, {
      method: 'PATCH',
      headers,
      body,
    });
    return result.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function get(url: string) {
  try {
    let headers = {};
    const store = getStore(authStore);
    if (store && store.jwtToken) {
      headers['Authorization'] = `Bearer ${store.jwtToken}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    if (response.status == 401) {
      authStore.set(null);
      goto('/login');
    }
    return response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function remove(url: string) {
  try {
    let headers = {};
    const store = getStore(authStore);
    if (store && store.jwtToken) {
      headers['Authorization'] = `Bearer ${store.jwtToken}`;
    }
    const result = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return result.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}