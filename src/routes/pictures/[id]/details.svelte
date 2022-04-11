<script context="module">
  export async function load({ page }) {
    const response = await get(
      `http://localhost:4000/api/pictures/${page.params.id}`
    );
    return {
      props: {
        imageDetails: response.data,
      },
    };
  }
</script>

<script>
  import CommentList from "$components/comment/CommentList.svelte";
  import Navbar from "$components/navbar/Navbar.svelte";
  import { get, post, remove } from "$lib/request-utils";
  import { userStore } from "$stores/user";
  import { onMount } from "svelte";

  export let imageDetails;
  export let comments = [];

  let liked = false;
  let likes = 0;

  onMount(async () => {
    likes = imageDetails.likes.length;
    liked = imageDetails.likes.filter(like => like.userId == $userStore.userId).length > 0;

    const response = await get(
      `http://localhost:4000/api/comments?picture=${imageDetails.id}`
    );
    comments = response.data;
  });

  async function handlePictureLike() {
    const response = await post(`http://localhost:4000/api/likes`, {
      pictureId: imageDetails.id,
    });
    liked = true;
    likes++;
  }

  async function handlePictureDislike() {
    const response = await remove(`http://localhost:4000/api/likes?picture=${imageDetails.id}`);
    liked = false;
    likes--;
  }
</script>

<Navbar />

<div class="container">
  <div class="section is-small" />

  <section class="box">
    <div class="level">
      <div class="level-item level-left">
        <p class="subtitle is-4">
          Picture added by
          <a>{imageDetails.user.username}</a>
        </p>
      </div>
      <div class="level-item level-right">
        {#if liked}
          <button class="button is-danger is-strong" on:click={handlePictureDislike}>
            <strong>Liked!</strong>
            <i class="fas fa-heart ml-2"></i>
          </button>
        {:else}
          <button class="button is-strong" on:click={handlePictureLike}>
            <strong>Like</strong>
            <i class="far fa-heart ml-2"></i>
          </button>
        {/if}
      </div>
    </div>

    <div class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Likes</p>
          <p class="title">{likes}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Comments</p>
          <p class="title">{comments.length}</p>
        </div>
      </div>
    </div>

    <div class="container is-fluid">
      <div class="card-image">
        <figure class="image">
          <img src={imageDetails.path} alt="" />
        </figure>
        <div class="container is-fluid mt-3">
          <div class="level">
            <div class="level-item level-left">
              {#each imageDetails.tags as tag}
                <span class="tag is-info is-light ml-2">{tag.name}</span>
              {/each}
            </div>
            <div class="level-item level-right">
              <p class="is-6 has-text-grey">{new Date()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<div class="container">
  <div class="section">
    <CommentList {comments} pictureId={imageDetails.id} />
  </div>
</div>
