<template>
    <div>
        <h1>Password store</h1>
        <input v-model="name" type="text" placeholder="name of secret">
        <input v-model="secret" type="text" placeholder="secret itself">
        <button v-on:click="storeSecret(name,secret)">Add</button>
        <p v-if="duplicate">Secret with that name already exists!</p>
        <ul id="example-2">
            <password v-for="item in listItems" :key="item.name" v-bind:name="item.name" v-bind:secret="item.secret"
                      v-bind:removeItem="removeItem"/>
        </ul>
    </div>

</template>

<script>
    import Password from "./Password";

    export default {
        name: "PasswordStore",
        components: {Password},
        data: function () {
            return {
                listItems: [
                    {name: "test", secret: "key"},
                    {name: "cool", secret: "jejda"}
                ],
                name: "",
                secret: "",
                duplicate: false
            };
        },
        methods: {
            storeSecret: function (name, secret) {
                //čeknutí jestli už to v array není


                this.$data.duplicate = false;

                if (name && secret) {
                    if (!this.$data.listItems.some(i => i.name === name)) {
                        this.$data.listItems.push({name: name, secret: secret})
                    } else if (name) {
                        this.$data.duplicate = true;
                        // console.error("secret with that name already exists");
                    }
                }
            },
            removeItem: function (name) {
                const items = this.$data.listItems;
                const index = this.$data.listItems.findIndex((i) => i.name === name);
                this.$data.listItems = items.slice(0, index).concat(items.slice(index + 1, items.length))
                // this.$data.listItems.remove();
            }
        }
    }
</script>

<style scoped>

</style>
