<script>
  import Hero from "$components/hero/Hero.svelte";
  import { get } from "$lib/request-utils";
  import { onMount } from "svelte";

  let pictures = [];
  let searchText = '';

  onMount(async () => {
    const response = await get(
      `http://localhost:4000/api/pictures/public`
    );
    pictures = [...pictures, ...response.data];
  });

  async function handleSearchPictures() {
    const response = await get(
      `http://localhost:4000/api/pictures/search?tags=${searchText}`
    );
    pictures = response.data;
  }

</script>

<Hero/>

<div class="container my-6">
  <div class="box">
    <h3 class="title">
      Are you looking for something specific?
    </h3>
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input bind:value={searchText} class="input" type="text" placeholder="Find a photo by name or tags . . .">
      </p>
      <p class="control">
        <button on:click={handleSearchPictures} class="button is-outlined is-primary">
          <strong>Search</strong>
        </button>
      </p>
    </div>
  </div>
</div>

<div class="container is-fluid">
  <div class="columns is-multiline is-vcentered">
    {#each pictures as image}
      <div class="column is-one-quarter">
        <div class="card-image">
          <figure class="image">
            <a href="pictures/{image.id}/details">
              <img src={image.path} alt="" />
            </a>
          </figure>
        </div>
      </div>
    {/each}
  </div>
</div>
