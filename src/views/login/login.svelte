<script lang="ts">
	import { navigation } from "../../lib/navigation";
	import { storageManager } from "../../stores/storage-manager";


  async function login (event : SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    storageManager.login(email, password)
      .then(async () => {
        try {
         await storageManager.loadAllInfo()
        } catch { return; }
        navigation.navigateTo("/home")
      })
      .catch(() => {
        window.alert("Login Failure, verify credentials")
      });

    event.preventDefault();
  }
</script>

<div class="text-center w-full pt-40 self-center align-center">
  <!-- <p class="text-3xl">Mapikit Logo</p> -->
  <img src="/logo.svg" alt="mapikit-logo" class="block mx-auto w-16 mb-8 align-center"/>
  <form class="pt-3 w-1/6 self-center inline-grid" on:submit={event => login(event)}>
    <input class="w-full bg-norbalt-400 rounded-lg pl-3 p-1 placeholder:text-norbalt-100 placeholder:font-semibold" type="text" name="email" placeholder="email"><br>
    <input class="mt-4 w-full bg-norbalt-400 rounded-lg pl-3 p-1 placeholder:text-norbalt-100 placeholder:font-semibold" type="password" name="password" placeholder="password"><br>
    <table class="text-xs w-full inline-grid self-center mt-1">
      <tr class="w-full nobreak"><td class="inline-block text-left w-1/2"><a href="/register">Create Account</a></td><td class="inline-block text-right w-1/2">Forgot Password?</td></tr>
    </table><br>
    <input class="mt-6 bg-norbalt-100 border-transparent border-2 px-10 rounded hover:text-brightGreen hover:border-brightGreen" id="button" type="submit" value="Login"><br><br>
  </form>
</div>