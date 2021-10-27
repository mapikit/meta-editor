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
    height:  300px;

    h1 {
      font-size: 48px;
      margin-bottom: 6px;
      font-family: 'Livvic', sans-serif;
      font-weight: normal;
    }
    
    p {
      font-size: 18px;
      margin: 0;

      span {
        color: #46ee92;
      }
    }
  }

  img {
    height: 140px;
  }

  .slogan {
    font-size: 22px;
  }

  .logo {
    margin-bottom: 6px;
  }

  @media only screen and (min-width: 768px) {
    .center-container {
      height:  450px;

      h1 {
        font-size: 58px;
        margin-bottom: 6px;
      }

      p {
        font-size: 22px;
      }
    }

    img {
      height: 180px;
    }

    .logo {
      margin-bottom: 28px;
    }
  }

  @media only screen and (min-width: 1390px) {
    .center-container {
      height:  550px;

      h1 {
        font-size: 58px;
        margin-bottom: 6px;
      }
    }

    img {
      height: 210px;
    }

    .logo {
      margin-bottom: 28px;
    }
  }

  </style>