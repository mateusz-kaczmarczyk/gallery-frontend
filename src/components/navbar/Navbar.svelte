<script>
  import { goto } from "$app/navigation";
  import { get } from "$lib/request-utils";
  import { authStore } from "$stores/auth";
  import { userStore } from "$stores/user";
  import { toast } from "bulma-toast";
  import { onMount } from "svelte";

  let loading = true;

  onMount(async () => {
    if ($authStore && !$userStore.avatar) {
      const response = await get(`http://localhost:4000/api/users/me`);
      $userStore.avatar = response.data.avatar;
    }
    loading = false;
  });

  async function logout() {
    await goto('/');
    $authStore = null;
    toast({
      message: "Successfully logged out",
      type: "is-success",
      dismissible: true,
      animate: { in: "fadeIn", out: "fadeOut" },
      position: "bottom-right",
    });
  }
</script>

<div class="container is-fluid mt-2">
  <nav class="navbar">
    <div class="navbar-menu">
      <div class="navbar-start">
        <a href="/" class="navbar-item">
          <strong>Home</strong>
        </a>
      </div>
      <div class="navbar-end">
        {#if loading}
          <div class="navbar-item">
            <button class="button is-invisible" />
          </div>
        {:else if $authStore == null}
          <div class="navbar-item">
            <div class="field is-grouped">
              <p class="control">
                <a class="button" href="/sign-up">
                  <span class="icon">
                    <i class="fas fa-user-plus" />
                  </span>
                  <span> Sign up </span>
                </a>
              </p>
              <p class="control">
                <a class="button is-dark" href="/login">
                  <span class="icon">
                    <i class="fas fa-sign-in-alt" />
                  </span>
                  <span>
                    <strong>Login</strong>
                  </span>
                </a>
              </p>
            </div>
          </div>
        {:else}
          <div class="navbar-item">
            <div class="field is-grouped">
              <p class="control">
                <a class="navbar-item" href="/{$authStore.username}/pictures">
                  <div class="image mr-2">
                    <img class="is-rounded" src={$userStore.avatar} alt="avatar">
                  </div>
                  <span class="subtitle">{$authStore.username}</span>
                </a>
              </p>
            </div>
          </div>
          <div class="navbar-item">
            <div class="field is-grouped">
              <p class="control">
                <button class="button" on:click={logout}>
                  <span> Sign out </span>
                  <span class="icon">
                    <i class="fas fa-sign-out-alt" />
                  </span>
                </button>
              </p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </nav>
</div>
