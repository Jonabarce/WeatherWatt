<template>
  <div class="header-wrapper">
    <NuxtLink to="/">
      <div class="logo-header-wrapper">
        <img src="/pictures/sun.png" alt="" />
        <p>Værwatt</p>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.logo-header-wrapper {
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

.logo-header-wrapper img {
  width: 10rem;
  height: 10rem;
}
</style>
