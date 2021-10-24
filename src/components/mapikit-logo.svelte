<div class="center-container flex">
  <div class="logo">
    <img src="/icon_mapikit.svg" alt="Mapikit Logo"/>
  </div>
  <div class="slogan">
    <h1> mapikit </h1>
    <p> The true <span> development </span> catalyst </p> 
  </div>
</div>

<style lang="scss">
  .flex {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  .center-container {
    width: 100%;
    height:  500px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 58px;
      margin-bottom: 6px;
      font-family: 'Livvic', sans-serif;
      font-weight: normal;
    }
    
    p {
      margin: 0;

      span {
        color: #46ee92;
      }
    }
  }

  img {
    height: 160px;
  }

  .slogan {
    font-size: 22px;
  }

  .logo {
    margin-bottom: 28px;
  }
  
</style>