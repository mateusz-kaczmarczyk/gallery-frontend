<script>
import { post } from "$lib/request-utils";

  import { authStore } from "$stores/auth";
  import { userStore } from "$stores/user";
import { toast } from "bulma-toast";
  import Comment from "./Comment.svelte";
  export let comments;
  export let pictureId;

  let comment = "";

  async function handleSubmitComment() {
    if (comment != "") {
      const response = await post(`http://127.0.0.1:4000/api/comments`, {
        pictureId: pictureId,
        content: comment,
      });
      comments = [ response.data, ...comments ];
      comment = '';
      toast({
        message: "Successfully added comment",
        type: "is-success",
        dismissible: true,
        animate: { in: "fadeIn", out: "fadeOut" },
        position: "bottom-right",
      });
    }
  }
</script>

{#if $authStore}
  <div class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img src={$userStore.avatar} alt="avatar" />
      </p>
    </figure>

    <div class="media-content">
      <div class="field">
        <p class="control">
          <textarea
            bind:value={comment}
            class="textarea"
            placeholder="Add a comment..."
          />
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button on:click={handleSubmitComment} class="button"
            >Post comment</button
          >
        </p>
      </div>
    </div>
  </div>
{:else}
  <div class="section subtitle pl-0">
    Please
    <a href="/login"> log in </a>
    to write a comment.
  </div>
{/if}

{#each comments as comment}
  <Comment bind:comment />
{/each}