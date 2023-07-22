<template>
  <div class="footer-wrapper">
    <NuxtLink to="/">
      <div class="logo-footer-wrapper">
        <img src="/pictures/sun.png" alt="" />
        <p>Værwatt</p>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.logo-footer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 1rem;
  text-decoration: none;
  color: #000;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
}

.logo-footer-wrapper img {
  width: 3rem;
  height: 3rem;
}

.logo-footer-wrapper p {
  font-size: 1rem;
  font-weight: 700;
}
</style>
