<script>
  import { goto } from "$app/navigation";

  import Hero from "$components/hero/Hero.svelte";
import { post } from "$lib/request-utils";
  import { toast } from "bulma-toast";

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  let formReady = false;

  const formData = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };

  const inputColor = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };

  const errorMessage = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };

  function handleInput(event) {
    if (event.target.value == "") {
      inputColor[event.target.id] = "is-danger";
    } else {
      inputColor[event.target.id] = "is-success";
      errorMessage[event.target.id] = "";
    }
    if (event.target.id == "email") {
      const validEmail = validateEmail(event.target.value);
      inputColor[event.target.id] = validEmail ? "is-success" : "is-danger";
    }
    formReady = true;
    for (const value of Object.values(inputColor)) {
      if (value == "" || value == "is-danger") {
        formReady = false;
        break;
      }
    }
  }

  async function handleSubmit() {
    if (!formReady) {
      for (const [key, value] of Object.entries(inputColor)) {
        if (value == "") {
          inputColor[key] = "is-danger";
        }
      }
      toast({
        message: "Please correct highlighted errors before submitting",
        type: "is-danger",
        dismissible: true,
        animate: { in: "fadeIn", out: "fadeOut" },
        position: "bottom-right",
      });
      return;
    }
    for (const key of Object.keys(errorMessage)) {
      errorMessage[key] = "";
    }

    const response = await post('http://127.0.0.1:4000/api/auth/sign-up', { ...formData });
    if (response.statusCode == 201) {
      toast({
        message: "Account successfully created",
        type: "is-success",
        dismissible: true,
        animate: { in: "fadeIn", out: "fadeOut" },
        position: "bottom-right",
        duration: 4000,
      });
      goto("/");
    }
    if (response.statusCode != 201) {
      if (response.errors) {
        response.errors.forEach((error) => {
          inputColor[error.field] = "is-danger";
          errorMessage[error.field] = error.errorMessage;
          toast({
            message: error.errorMessage,
            type: "is-danger",
            dismissible: true,
            animate: { in: "fadeIn", out: "fadeOut" },
            position: "bottom-right",
            duration: 2000,
          });
        });
      } else {
        toast({
          message: response.message,
          type: "is-danger",
          dismissible: true,
          animate: { in: "fadeIn", out: "fadeOut" },
          position: "bottom-right",
          duration: 2000,
        });
      }
    }
    if (response.field) {
      inputColor[response.field] = "is-danger";
      errorMessage[response.field] = response.message;
    }
  }
</script>

<Hero />

<div class="columns is-centered">
  <div class="is-half">
    <div class="container">
      <p class="is-size-4 my-6 has-text-centered">
        Please fill out the form below to create a new account
      </p>

      <form on:submit|preventDefault={handleSubmit}>
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <label class="label" for='firstName'>First name</label>
              <div class="control">
                <input
                  class="input {inputColor['firstName']}"
                  type="text"
                  placeholder="John"
                  id="firstName"
                  on:input={(event) => handleInput(event)}
                  bind:value={formData.firstName}
                />
              </div>
            </div>
            <div class="field">
              <label class="label" for='lastName'>Last name</label>
              <div class="control">
                <input
                  class="input {inputColor['lastName']}"
                  type="text"
                  placeholder="Rambo"
                  id="lastName"
                  on:input={(event) => handleInput(event)}
                  bind:value={formData.lastName}
                />
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label" for='username'>Username</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input {inputColor['username']}"
              type="text"
              placeholder="username"
              id="username"
              on:input={(event) => handleInput(event)}
              bind:value={formData.username}
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user" />
            </span>
          </div>
          <p class="help is-danger">{errorMessage.username}</p>
        </div>

        <div class="field">
          <label class="label" for='email'>Email</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input {inputColor['email']}"
              type="email"
              placeholder="user@example.com"
              id="email"
              on:input={(event) => handleInput(event)}
              bind:value={formData.email}
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
          </div>
          <p class="help is-danger">{errorMessage.email}</p>
        </div>

        <div class="field">
          <label class="label" for='password'>Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input {inputColor['password']}"
              type="password"
              placeholder="Email input"
              id="password"
              on:input={(event) => handleInput(event)}
              bind:value={formData.password}
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>
          </div>
          <p class="help is-danger">{errorMessage.password}</p>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" />
              I agree to the <a href="/privacy-policy">privacy policy</a>
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
