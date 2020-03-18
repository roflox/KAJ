<template>

    <li>{{name}}: {{secret}}
        <button v-on:click="removeItem(name)" >Remove</button>
    </li>
</template>

<script>
    export default {
        name: "Password",
        props: {
            name: String,
            secret: String,
            removeItem: Function
        }
    }
</script>

<style scoped>

</style>
