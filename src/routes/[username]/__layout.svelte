<script>
  import { goto } from "$app/navigation";
  import Hero from "$components/hero/Hero.svelte";
  import { get } from "$lib/request-utils";
  import { authStore } from "$stores/auth";
  import { onMount } from "svelte";
  import { userStore } from "$stores/user";

  let loading = true;

  onMount(async () => {
    if ($authStore == null) {
      await goto("/login");
      return;
    }
    const response = await get("http://127.0.0.1:4000/api/users/me");
    loading = false;
  });
</script>

<Hero />

{#if loading}
  <!-- loading... -->
{:else}
  <div class="tabs is-centered is-boxed">
    <ul class="has-background-light">
      <li class={$userStore.profileTab == "notifications" ? "is-active" : ""}>
        <a href="/{$authStore.username}/notifications">
          <span class="icon is-small">
            <i class="fas fa-bell" />
          </span>
          <span>Notifications</span>
        </a>
      </li>
      <li class={$userStore.profileTab == "pictures" ? "is-active" : ""}>
        <a href="/{$authStore.username}/pictures">
          <span class="icon is-small">
            <i class="fas fa-images" />
          </span>
          <span>Pictures</span>
        </a>
      </li>
      <li class={$userStore.profileTab == "galeries" ? "is-active" : ""}>
        <a href="/{$authStore.username}/galeries">
          <span class="icon is-small">
            <i class="fas fa-folder" />
          </span>
          <span>Galeries</span>
        </a>
      </li>
      <li class={$userStore.profileTab == "settings" ? "is-active" : ""}>
        <a href="/{$authStore.username}/settings">
          <span class="icon is-small">
            <i class="fas fa-cog" />
          </span>
          <span>Settings</span>
        </a>
      </li>
    </ul>
  </div>

  <slot />
{/if}
