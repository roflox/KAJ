<template>
    <div id="app">
        <password-store></password-store>
    </div>
</template>

<script>

    import PasswordStore from "./components/PasswordStore.vue";


    export default {
        name: 'App',
        components: {
            PasswordStore
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
