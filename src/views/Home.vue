<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <b-form inline>
        <b-input
          v-model="newItem"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="New Item"
          @keydown.enter.prevent="addShoppingItem"
        ></b-input>
        <b-button variant="primary" @click.prevent="addShoppingItem">
          Add
        </b-button>
      </b-form>
      <br />
    </div>

    <div class="row mt-4 justify-content-center">
      <b-col md="6" sm="12">
        <b-list-group class>
          <b-list-group-item v-for="(item, index) in listItems" :key="index">
            <b-row class="flex-row">
              <b-col class="d-flex justify-content-around align-items-center">
                {{ item.itemName }}
                <b-button
                  size="sm"
                  variant="danger"
                  @click="deleteShoppingItem(item.id)"
                >
                  Delete
                </b-button>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </div>
  </div>
</template>

<script>
//import Amplify
import { Auth, API, graphqlOperation } from "aws-amplify";
import { components } from "aws-amplify-vue";
//import amplify graphql operations
import * as queries from "@/graphql/queries";
import * as mutations from "@/graphql/mutations";
import * as subscriptions from "@/graphql/subscriptions";
export default {
  components: {
    ...components
  },
  data() {
    return {
      listItems: [],
      newItem: "",
      sub: ""
    };
  },
  async mounted() {
    //Get the current logged in user
    let currentUser = await Auth.currentAuthenticatedUser();
    let that = this;
    //Create a subscription to listen for newly created items
    API.graphql(
      graphqlOperation(subscriptions.onCreateShoppingListItem, {
        owner: currentUser.username
      })
    ).subscribe({
      //Push the new items onto our listItems array for dispay
      next: action => {
        that.listItems.push(action.value.data.onCreateShoppingListItem);
      }
    });
    //Create a subscription to listen for deleted items
    API.graphql(
      graphqlOperation(subscriptions.onDeleteShoppingListItem, {
        owner: currentUser.username
      })
    ).subscribe({
      next: action => {
        //Remove the item onto our listItems array for dispay
        let id = action.value.data.onDeleteShoppingListItem.id;
        let index = that.listItems.map(x => x.id).indexOf(id);
        that.listItems.splice(index, 1);
      }
    });
  },
  async created() {
    // Get all shopping list items to display on page load
    const { data } = await API.graphql(
      graphqlOperation(queries.listShoppingListItems)
    );
    data.listShoppingListItems.items.forEach(item => {
      this.listItems.push(item);
    });
  },
  methods: {
    // call our graph mutation to add a new shopping list item
    async addShoppingItem() {
      await API.graphql(
        graphqlOperation(mutations.createShoppingListItem, {
          input: { itemName: this.newItem }
        })
      );
      //clear textbox
      this.newItem = "";
    },
    // call our graph mutation to add a new shopping list item
    deleteShoppingItem(itemId) {
      API.graphql(
        graphqlOperation(mutations.deleteShoppingListItem, {
          input: { id: itemId }
        })
      );
    }
  }
};
</script>