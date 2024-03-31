<template>
  <main class="error-page">
    <h1>Whoopsie Doodle!</h1>
    <div class="comic-bubble">
      <svg
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg">
        <ellipse
          cx="50%"
          cy="50%"
          rx="140"
          ry="100"
          class="speech-bubble" />
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          class="speech-text">404</text>
      </svg>
    </div>
    <p class="error-text">
      This page is more elusive than the last issue of "Spidey vs. Thanos"!
    </p>
    <p class="error-text">
      <a href="/">Zoom back to base!</a>
    </p>
  </main>
</template>

<style>
.error-page {
  background-color: #f5f5f5;
  text-align: center;
  padding: 50px;
  font-family: 'Bangers', cursive;


  h1 {
    font-size: 60px;
    color: #ff6347;
  }

  .comic-bubble {
    height: 300px;
    width: 300px;
    margin: 0 auto;
  }

  .error-text {
    color: #333;
    font-size: 30px;
    font-weight: bold;
  }

  a {
    color: #ff6347;
  }

  .speech-bubble {
    fill: none;
    stroke: #ff6347;
    stroke-width: 2px;
  }

  .speech-text {
    fill: #ff6347;
    font-size: 45px;
  }
}
</style>