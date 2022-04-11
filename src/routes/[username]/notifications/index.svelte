<script>
  import { userStore } from "$stores/user";
  import { onMount } from "svelte";

  onMount(async () => {
    $userStore.profileTab = 'notifications';
  })

</script>

<div class="container">
  <h1 class="title">Under construction . . .</h1>
</div>