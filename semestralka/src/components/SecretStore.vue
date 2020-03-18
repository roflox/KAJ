<template>
    <div>
        <h1>Password store</h1>
        <label for="nameInput">Secret name: <input id="nameInput" v-model="name" type="text"
                                                   placeholder="name of secret"></label>
        <label for="secretInput">Secret: <input id="secretInput" v-model="secret" type="text"
                                                placeholder="secret itself"></label>
        <button v-on:click="storeSecret(name,secret)">Add</button>
        <p v-if="duplicate">Secret with that name already exists!</p>

        <ul id="example-2">
            <password v-for="item in listItems" :key="item.name" v-bind:name="item.name" v-bind:secret="item.secret"
                      v-bind:removeItem="removeItem"/>
        </ul>
    </div>

</template>

<script>
    import Password from "./SecretItem";
    // import bcrypt from "bcryptjs";

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
        }, watch: {
            name() {

            }
        }
        ,
        methods: {
            storeSecret(name, secret) {
                //čeknutí jestli už to v array není


                this.$data.duplicate = false;

                if (name && secret) {
                    if (!this.$data.listItems.some(i => i.name === name)) {
                        // console.log(bcrypt.hash)
                        this.$data.listItems.push({name: name, secret: secret})
                    } else if (name) {
                        this.$data.duplicate = true;
                        // console.error("secret with that name already exists");
                    }
                }
            },
            removeItem(name) {
                const items = this.$data.listItems;
                const index = this.$data.listItems.findIndex((i) => i.name === name);
                this.$data.listItems = items.slice(0, index).concat(items.slice(index + 1, items.length))
                // this.$data.listItems.remove();
            }
        }
    }
</script>

<style scoped>
    button {
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        color: #fff;
        background-color: #007bff;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    button:hover {
        color: #fff;
        background-color: #0069d9;
        border-color: #0062cc;

    }
</style>
