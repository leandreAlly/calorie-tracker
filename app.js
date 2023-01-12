// Storage controller

const StorageCtrl = (function () {
  // Public Method
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new item
        items.push(item);
        // Save item to ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is alread in ls
        items = JSON.parse(localStorage.getItem("items"));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Datat structure /state
  const data = {
    // items: [
    //   // { id: 0, name: "steak dinner", calories: 1000 },
    //   // { id: 1, name: "cookie", calories: 400 },
    //   // { id: 1, name: "Egg", calories: 300 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      // create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // calories into number
      calories = parseInt(calories);

      // create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through the items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: function (name, calories) {
      //  calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    // Delete Item form DS
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      // Loop through item and add cals
      data.items.forEach((item) => {
        total += item.calories;

        // set total cal in data structure
        data.totalCalories = total;
      });

      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI controller
const UICtrl = (function () {
  const UISelector = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // Public method
  return {
    populateList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
              `;
      });
      //   populate list into ul
      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    getItemInputs: function () {
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calories: document.querySelector(UISelector.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show the List
      UICtrl.showList();
      const li = document.createElement("li");
      // add class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
       <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert Item
      document
        .querySelector(UISelector.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updatedListItem: function (item) {
      let listItems = document.querySelectorAll(UISelector.listItems);

      // Turn node list into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
           <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
              </a>
        `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelector.listItems);

      // Turn Node list Into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    clearInput: function () {
      document.querySelector(UISelector.itemNameInput).value = "";
      document.querySelector(UISelector.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelector.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelector.itemList).style.display = "none";
    },
    showList: function () {
      document.querySelector(UISelector.itemList).style.display = "block";
    },
    ShowTotalCalories: function (totalCalories) {
      document.querySelector(UISelector.totalCalories).textContent =
        totalCalories;
    },
    showEditState: function () {
      document.querySelector(UISelector.updateBtn).style.display = "inline";
      document.querySelector(UISelector.deleteBtn).style.display = "inline";
      document.querySelector(UISelector.backBtn).style.display = "inline";
      document.querySelector(UISelector.addBtn).style.display = "none";
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.deleteBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.addBtn).style.display = "inline";
    },
    getSelectors: function () {
      return UISelector;
    },
  };
})();

// App controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // load event listeners
  const loadEventListeners = function () {
    // get UISelectors
    const UISelector = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", itemAddsubmit);

    // Disble submit on Enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelector.itemList)
      .addEventListener("click", itemEditClick);

    // update item event
    document
      .querySelector(UISelector.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelector.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    //back button event
    document
      .querySelector(UISelector.backBtn)
      .addEventListener("click", function (e) {
        e.preventDefault();
      });
    // Delete item event
    document
      .querySelector(UISelector.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };
  // Add item submit
  const itemAddsubmit = function (e) {
    // Get form input form UI controller
    const input = UICtrl.getItemInputs();
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories into UI
      UICtrl.ShowTotalCalories(totalCalories);

      // Store in local Storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Update item Submit
  const itemUpdateSubmit = function (e) {
    //Get item Inputs
    const input = UICtrl.getItemInputs();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updatedListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories into UI
    UICtrl.ShowTotalCalories(totalCalories);

    // Update local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear Edit state after update
    UICtrl.clearEditState();

    e.preventDefault();
  };
  // Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete form Data Structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete item form UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories into UI
    UICtrl.ShowTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // Clear Edit state after update
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear items event
  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories into UI
    UICtrl.ShowTotalCalories(totalCalories);

    //Remove form UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Hide ul list
    UICtrl.hideList();
  };
  // Item edit click
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id(item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get actual id
      const id = parseInt(listIdArr[1]);

      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set the current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to the form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Public method
  return {
    init: function () {
      // Call Edit state
      UICtrl.clearEditState();

      // Fetch items form data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateList(items);
      }
      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories into UI
      UICtrl.ShowTotalCalories(totalCalories);

      //   call load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
