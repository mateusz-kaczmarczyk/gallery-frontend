<script>
  import { get, patch, post, remove } from "$lib/request-utils";
  import { authStore } from "$stores/auth";
  import { userStore } from "$stores/user";
  import { toast } from "bulma-toast";
  import { onMount } from "svelte";

  let newPictureModalActive = false;
  let updatePictureModalActive = false;
  let updatePictureId;
  let tags = [];
  let tagInput = "";
  let isPublic = true;
  let pictures = [];
  let picture;

  onMount(async () => {
    $userStore.profileTab = "pictures";
    const response = await get(
      `http://localhost:4000/api/pictures?user=${$authStore.username}`
    );
    pictures = [...pictures, ...response.data];
  });

  function openExistingPicture(image) {
    updatePictureModalActive = true;
    updatePictureId = image.id;
    picture = image.path;
    isPublic = !image.private;
    tags = image.tags.map((tag) => tag.name);
  }

  async function handleDeletePicture() {
    await remove(`http://localhost:4000/api/pictures/${updatePictureId}`);
    pictures = pictures.filter(function(picture) { return picture.id != updatePictureId });
    reset();
    toast({
      message: "Successfully deleted picture",
      type: "is-success",
      dismissible: true,
      animate: { in: "fadeIn", out: "fadeOut" },
      position: "bottom-right",
    });
  }

  function removeTag(tagName) {
    tags = tags.filter(function(tag) { return tag != tagName });
  }

  async function handleUpdatePicture() {
    const response = await patch(`http://localhost:4000/api/pictures/${updatePictureId}`, {
      private: !isPublic,
      tags: tags,
    });
    const pictureIndex = pictures.findIndex(picture => picture.id == updatePictureId);
    pictures[pictureIndex] = response.data;
    reset();
    toast({
      message: "Successfully updated picture",
      type: "is-success",
      dismissible: true,
      animate: { in: "fadeIn", out: "fadeOut" },
      position: "bottom-right",
    });
  }

  function onFileSelected(event) {
    let image = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      picture = e.target.result;
    };
  }

  function handleTagsInput(event) {
    if (event.data == " ") {
      const newTag = tagInput.substring(0, tagInput.length - 1);
      if (!tags.includes(newTag)) {
        tags = [...tags, newTag];
      }
      tagInput = "";
    }
  }

  function reset() {
    newPictureModalActive = false;
    updatePictureModalActive = false;
    updatePictureId = null;
    tags = [];
    picture = null;
  }

  async function handlePictureUpload() {
    const extension = picture.split(";")[0].split("/")[1];
    const base64 = picture.split(";")[1].split(",")[1];
    const result = await post("http://127.0.0.1:4000/api/pictures", {
      private: !isPublic,
      data: base64,
      extension: extension,
      tags: tags,
    });
    pictures = [...pictures, result.data];
    reset();
    toast({
      message: "Successfully uploaded picture",
      type: "is-success",
      dismissible: true,
      animate: { in: "fadeIn", out: "fadeOut" },
      position: "bottom-right",
    });
  }
</script>

<div class="container is-fluid">
  <div class="block">
    <button
      class="button is-success is-medium js-modal-trigger"
      data-target="modal-js-example"
      on:click={() => (newPictureModalActive = true)}>Upload picture</button
    >
  </div>

  <div class="title">Pictures ({pictures.length})</div>

  <div class="columns is-multiline is-vcentered">
    {#each pictures as image}
      <div class="column is-one-quarter">
        <div class="card-image">
          <figure class="image">
            <a
              href="#{image.id}"
              on:click={(event) => {
                openExistingPicture(image);
              }}
            >
              <img src={image.path} alt="" />
            </a>
          </figure>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Upload new picture modal -->
<div class="modal {newPictureModalActive ? 'is-active' : ''}">
  <div class="modal-background" on:click={reset}/>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Upload picture</p>
      <button on:click={reset} class="delete" aria-label="close" />
    </header>
    <section class="modal-card-body">
      {#if picture}
        <div class="container">
          <div class="card-image">
            <figure class="image">
              <img src={picture} alt="" />
            </figure>
          </div>

          <div class="control">
            <label class="radio">
              <input type="radio" bind:group={isPublic} checked value={true} />
              Public
            </label>
            <label class="radio">
              <input type="radio" bind:group={isPublic} value={false} />
              Private
            </label>
          </div>

          <div class="field mt-2">
            <label class="label" for="tags">Tags</label>
            <div class="control">
              <input
                class="input"
                id="tags"
                type="text"
                bind:value={tagInput}
                on:input={(event) => handleTagsInput(event)}
              />
            </div>
          </div>

          <div class="mt-2">
            {#each tags as tag}
              <span class="tag is-info is-light ml-2">{tag}</span>
            {/each}
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
              <span class="file-label"> Upload picture </span>
            </span>
          </label>
        </div>
      {/if}
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={() => handlePictureUpload()}
        >Upload</button
      >
      <button class="button" on:click={reset}>Cancel</button>
    </footer>
  </div>
</div>

<!-- Update picture modal -->
<div class="modal {updatePictureModalActive ? 'is-active' : ''}">
  <div class="modal-background" on:click={reset}/>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit picture</p>
      <button on:click={reset} class="delete" aria-label="close" />
    </header>
    <section class="modal-card-body">
      {#if picture}
        <div class="container">
          <div class="card-image">
            <figure class="image">
              <a href="/pictures/{updatePictureId}/details">
                <img src={picture} alt="" />
              </a>
            </figure>
          </div>

          <div class="control">
            <label class="radio">
              <input type="radio" bind:group={isPublic} checked value={true} />
              Public
            </label>
            <label class="radio">
              <input type="radio" bind:group={isPublic} value={false} />
              Private
            </label>
          </div>

          <div class="field mt-2">
            <label class="label" for="tags">Tags</label>
            <div class="control">
              <input
                class="input"
                id="tags"
                type="text"
                bind:value={tagInput}
                on:input={(event) => handleTagsInput(event)}
              />
            </div>
          </div>

          <div class="mt-2">
            {#each tags as tag}
              <a href="#{tag}" on:click={(event) => {
                removeTag(tag);
              }}>
                <span class="tag is-info is-light ml-2">
                  {tag}
                  <i class="far fa-times-circle ml-1"></i>
                </span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={handleUpdatePicture}
        >Save</button
      >
      <button class="button is-danger" on:click={handleDeletePicture}
        >Delete</button
      >
      <button class="button" on:click={reset}>Cancel</button>
    </footer>
  </div>
</div>
