<!-- TEST TO USE COMMECT IN template tag-->

<!-- Create login UI.
Luckily Amplify Framework has an authentication UI component we 
can use that will provide the entire authentication flow for us, using our
 configuration specified in our aws-exports.js file.-->
<template>
    <amplify-authenticator></amplify-authenticator>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify"; 

// You can refer this link for better understanding of AmplifyEventBus nad its Events.
// https://haverchuck.github.io/docs/js/vue
export default defineComponent({
    //An async method runs synchronously until it reaches its first await expression, 
    //at which point the method is suspended until the awaited task is complete.
    async mounted() {
        // if the user is signedIn, then send to Home route else back to the Authentication page.
        AmplifyEventBus.$on("authState", eventInfo => {
            if(eventInfo === "signedIn"){
                this.$router.push({ name : "Home"});
            } else if (eventInfo === "signedOut"){
                this.$$router.push({ name : "Auth"});
            }
        });
    // if the user is already authenticated, send them to "Home page" else Auth Page.
        try {
            await Auth.currentAuthenticatedUser();
            this.$router.push({name : "Home"});
        } catch (error) {
            his.$router.push({name : "Auth"});
        }   
    },
});
</script>

