<script>
  import { goto } from "$app/navigation";
  import Hero from "$components/hero/Hero.svelte";
  import { toast } from "bulma-toast";
  import { authStore } from '$stores/auth'
  import jwtDecode from "jwt-decode";

  let formData = {
    username: "",
    password: "",
  };

  const inputColor = {
    username: "",
    password: "",
  };

  let errorMessage = "";

  function handleInput(event) {
    inputColor[event.target.id] = "";
    errorMessage = '';
  }

  async function handleSubmit() {
    let formReady = true;
    for (const [key, value] of Object.entries(formData)) {
      if (value == "") {
        inputColor[key] = "is-danger";
        formReady = false;
      }
    }
    if (!formReady) {
      toast({
        message: "Please correct highlighted errors before submitting",
        type: "is-danger",
        dismissible: true,
        animate: { in: "fadeIn", out: "fadeOut" },
        position: "bottom-right",
      });
      return;
    }

    const res = await fetch("http://127.0.0.1:4000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (json.statusCode != 200) {
      toast({
        message: json.message,
        type: "is-danger",
        dismissible: true,
        animate: { in: "fadeIn", out: "fadeOut" },
        position: "bottom-right",
        duration: 2000,
      });
      errorMessage = json.message;
    } else {
      toast({
      message: "Successfully logged in",
      type: "is-success",
      dismissible: true,
      animate: { in: "fadeIn", out: "fadeOut" },
      position: "bottom-right",
    })
      const decodedJwt = jwtDecode(json.data.jwtToken);
      $authStore = {
        username: decodedJwt['cognito:username'],
        jwtToken: json.data.jwtToken
      };
      goto("/");
    }
  }
</script>

<Hero />

<div class="columns is-centered">
  <div class="is-half">
    <div class="container">
      <p class="is-size-4 my-6 has-text-centered">Welcome back!</p>

      <form on:submit|preventDefault={handleSubmit}>
        <div class="field">
          <p class="control has-icons-left has-icons-right">
            <input
              class="input {inputColor['username']}"
              type="input"
              placeholder="Username"
              id="username"
              bind:value={formData.username}
              on:input={(event) => handleInput(event)}
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control has-icons-left">
            <input
              class="input {inputColor['password']}"
              type="password"
              placeholder="Password"
              id="password"
              bind:value={formData.password}
              on:input={(event) => handleInput(event)}
            />
            <span class="icon is-small is-left">
              <i class="fas fa-lock" />
            </span>
          </p>
          <p class="help is-danger">{errorMessage}</p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link">Login</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
