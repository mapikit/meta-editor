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

<div>
  <form on:submit={event => login(event)}>
    <input id="text" type="text" name="email" placeholder="email"><br><br>
    <input id="text" type="password" name="password" placeholder="password"><br><br>

    <input id="button" type="submit" value="Login"><br><br>

    <a href="register page">...or register here</a><br><br>
  </form>
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 10%;
  }

  form {
    
    align-self: center;
  }

  #text {
    background-color: darkgray;
    padding-left: 5px;
    padding-right: 5px;
  }
  #text::placeholder {
    color: #515151;
  }
</style>