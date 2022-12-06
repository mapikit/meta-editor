<script lang="ts">
	import { slide } from "svelte/transition";
	import { storageManager } from "../../stores/storage-manager";

  let emailTaken = false;
  let emailInvalid = false;
  let passwordInvalid = false;
  let emailEmpty = false;
  let passwordEmpty = false;
  let loading = false;
  let emailField = "";
  let passwordField = "";
  let checkDelay : NodeJS.Timeout = undefined

  $: userIsAvailable(emailField)

  
  function timeoutCheck (email : string) {
    return async () => {
      if(emailInvalid) return;
      emailTaken = await storageManager.manager.userExists(email);
      loading = false;
    }
  }

  async function userIsAvailable (email : string) {
    loading = true;
    if(checkDelay === undefined) {
      checkDelay = setTimeout(timeoutCheck(email), 700);
    } else  {
      clearTimeout(checkDelay);
      checkDelay = setTimeout(timeoutCheck(email), 700);
    }
  }

  async function register(event : SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    storageManager.manager.registerUser(email, password)
      .then(async () => {
        window.alert("Successful registration");
      })
      .catch(() => {
        window.alert("Registration Failure")
      });

  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  $: emailInvalid = emailField !== "" && !emailRegex.test(emailField.toLowerCase());

  let emailBorder = "border-transparent", passwordBorder = "border-transparent";

  $: emailBorder = emailTaken || emailInvalid ? "border-roseRed" : "border-transparent"
  $: passwordBorder = passwordInvalid ? "border-roseRed" : "border-transparent"
  $: emailEmpty = emailField === "";
  $: passwordEmpty = passwordField === "";
  $: registerColor = emailEmpty || emailInvalid || emailTaken || passwordEmpty || loading
    ? "bg-norbalt-400 text-norbalt-200 hover:text-norbalt-200 hover:border-transparent" : "bg-norbalt-100"

</script>

<div class="text-center w-full pt-40 self-center align-center">
  <!-- <p class="text-3xl">Mapikit Logo</p> -->
  <img src="/logo.svg" alt="mapikit-logo" class="block mx-auto w-16 mb-8 align-center"/>
  <form class="pt-3 w-1/6 self-center inline-grid" on:submit={event => register(event)}>
    <input 
      class="outline-none border-2 w-full bg-norbalt-400 rounded-lg pl-3 p-1 placeholder:text-norbalt-100 placeholder:font-semibold {emailBorder}" 
      type="text" 
      name="email" 
      placeholder="email"
      bind:value={emailField}
    ><br>
    {#if emailInvalid} <p transition:slide class="text-roseRed text-left w-full"> • Email Format Invalid </p> {/if}
    {#if emailEmpty} <p transition:slide class="text-roseRed text-left w-full"> • An Email Address is required </p> {/if}
    {#if emailTaken} <p transition:slide class="text-roseRed text-left w-full"> • Email Already Taken </p> {/if}

    <input 
      class="outline-none mt-4 w-full bg-norbalt-400 rounded-lg pl-3 p-1 placeholder:text-norbalt-100 placeholder:font-semibold {passwordBorder}" 
      type="password" 
      name="password" 
      placeholder="password"
      bind:value={passwordField}
    >
    {#if passwordEmpty} <p transition:slide class="text-roseRed text-left w-full"> • A Password is Required </p> {/if}

    <br><input class="mt-6 {registerColor} border-transparent border-2 px-10 rounded hover:text-brightGreen hover:border-brightGreen" id="button" type="submit" value="Register"><br><br>
  </form>

</div>

<svelte:window on:keypress={() => console.log(emailInvalid)}/>