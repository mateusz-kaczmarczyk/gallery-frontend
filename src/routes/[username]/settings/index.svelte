<script lang="typescript">
  import { get, patch } from "$lib/request-utils";
  import { userStore } from "$stores/user";
  import { toast } from "bulma-toast";
  import { onMount } from "svelte";

  let modalActive = false;
  let avatar;
  let userAvatar;

  onMount(async () => {
    $userStore.profileTab = 'settings';
    const result = await get("http://127.0.0.1:4000/api/users/me");
    userAvatar = result.data.avatar;
  })

  function onFileSelected(event) {
    let image = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
      $userStore.avatar = avatar;
    };
  }

  function reset() {
    modalActive = false;
    avatar = null;
  }

  async function handleAvatarUpload() {
    const extension = avatar.split(";")[0].split("/")[1];
    const base64 = avatar.split(";")[1].split(",")[1];
    const result = await patch("http://127.0.0.1:4000/api/users", {
      avatarData: base64,
      extension: extension,
    });
    reset();
    userAvatar = result.data.avatar;
    toast({
      message: "Successfully updated avatar",
      type: "is-success",
      dismissible: true,
      animate: { in: "fadeIn", out: "fadeOut" },
      position: "bottom-right",
    });
  }

</script>

<div class="container">
  <h1 class="title">Avatar</h1>
  <figure class="image is-128x128">
    <a on:click={() => modalActive = true}>
      <img class="is-rounded" src={userAvatar}>
    </a>
  </figure>
</div>




<div class="modal {modalActive ? 'is-active' : ''}">
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Upload avatar</p>
      <button on:click={reset} class="delete" aria-label="close" />
    </header>
    <section class="modal-card-body">
      {#if avatar}
      <div class="container">
        <div class="card-image">
          <figure class="image">
            <img src={avatar} alt="" />
          </figure>
        </div>
      </div>
    {:else}
      <div class="file is-large is-boxed is-centered">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            on:change={(e) => onFileSelected(e)}
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload" />
            </span>
            <span class="file-label"> Upload avatar </span>
          </span>
        </label>
      </div>
    {/if}
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={() => handleAvatarUpload()}
        >Upload</button
      >
      <button class="button" on:click={reset}>Cancel</button>
    </footer>
  </div>
</div>