import React, { useState, useEffect } from "react";
import { db, auth } from "../backend/firebase";
import "./store.css";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

function Store() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [storedTotalPrice, setStoredTotalPrice] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch user's name
    const fetchUserData = async () => {
      try {
        const userInfoCollection = collection(db, "users");
        const currentUser = auth.currentUser;
        const userDoc = doc(userInfoCollection, currentUser.uid);
        const userData = await getDoc(userDoc);
        const { name, identity } = userData.data();
        setUserName(name);
        setIsAdmin(identity === "admin");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Define an asynchronous function to fetch data from Firestore
    const fetchData = async () => {
      try {
        // Get a reference to the "Coffee_Bean_List" document within the "stores" collection
        const coffeeBeanListDocRef = doc(db, "stores", "Coffee_Bean_List");

        // Fetch the document snapshot
        const docSnapshot = await getDoc(coffeeBeanListDocRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
          // Extract data from the document
          const coffeeBeanListData = docSnapshot.data();

          // Extract the "George_Coffee_Shop" array from the document data
          const georgeCoffeeList = coffeeBeanListData.George_Coffee_Shop;

          // Convert the array of maps to an array of objects
          const coffeeBeansArray = georgeCoffeeList.map((coffee) => {
            const coffeeName = Object.keys(coffee)[0];
            const price = coffee[coffeeName];
            return { beanType: coffeeName, price: price };
          });

          // Set the state with the extracted data
          setCoffeeBeans(coffeeBeansArray);

          // Initialize quantities with 0 for each coffee bean
          const initialQuantities = {};
          coffeeBeansArray.forEach((bean) => {
            initialQuantities[bean.beanType] = 0;
          });
          setQuantities(initialQuantities);
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch total price from Firestore whenever userName changes
    const fetchTotalPrice = async () => {
      try {
        if (!userName) return; // If userName is not set, return early

        // Get a reference to the user's document in the "transactions" collection
        const transactionDocRef = doc(collection(db, "transactions"), userName);

        // Fetch the document snapshot
        const docSnapshot = await getDoc(transactionDocRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
          // Extract totalMoney from the document data
          const totalMoney = docSnapshot.data().totalMoney;

          // Update the storedTotalPrice state
          setStoredTotalPrice(totalMoney);

          // Fetch shopping list items
          const shoppingListItems = docSnapshot.data().items || [];
          setShoppingList(shoppingListItems);
        } else {
          console.log("User's shopping document does not exist");
        }
      } catch (error) {
        console.error("Error fetching total price:", error);
      }
    };

    fetchTotalPrice();
  }, [userName]); // Run this effect whenever userName changes

  useEffect(() => {
    // Calculate total price
    let total = 0;
    coffeeBeans.forEach((bean) => {
      total += bean.price * quantities[bean.beanType];
    });
    setTotalPrice(total);
  }, [quantities, coffeeBeans]);

  useEffect(() => {
    // Update cart items
    const updatedCartItems = [];
    Object.entries(quantities).forEach(([beanType, quantity]) => {
      if (quantity > 0) {
        updatedCartItems.push({ beanType, quantity });
      }
    });
    setCartItems(updatedCartItems);
  }, [quantities]);

  const handleExport = async () => {
    try {
      // Fetch all documents from the "transactions" collection
      const querySnapshot = await getDocs(collection(db, "transactions"));

      // Check if there are any documents
      if (!querySnapshot.empty) {
        // Initialize an array to store all transaction data
        let allTransactionData = [];

        // Iterate over each document in the collection
        querySnapshot.forEach((doc) => {
          // Get the data from the document
          const transactionData = doc.data();

          // Iterate over each item in the transaction data and add it to the array
          transactionData.items.forEach((item) => {
            allTransactionData.push([
              item.itemCount,
              item.itemType,
              doc.id, // Add the document ID (user name) for each row
              item.itemTotalPrice,
            ]);
          });
        });

        // Format the data into a CSV string
        const csvContent = allTransactionData
          .map((row) => row.join(","))
          .join("\n");

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: "text/csv" });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element
        const link = document.createElement("a");
        link.href = url;
        link.download = "transaction_data.csv"; // Specify the filename

        // Simulate a click on the anchor element to trigger the download
        link.click();

        // Release the temporary URL
        window.URL.revokeObjectURL(url);
      } else {
        console.log("No documents found in the 'transactions' collection");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleDeleteAllDocuments = async () => {
    try {
      // Get a reference to the "transactions" collection
      const transactionsCollectionRef = collection(db, "transactions");

      // Get all documents within the collection
      const querySnapshot = await getDocs(transactionsCollectionRef);

      // Iterate over each document and delete it
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log("All documents in the transaction collection deleted successfully.");
      // Reload the webpage to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error("Error deleting documents in transaction collection:", error);
    }
  };

  const handleQuantityChange = (beanType, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [beanType]: quantity,
    }));
  };

  const handleSave = async () => {
    try {
      // Get a reference to the user's document in the "transactions" collection
      const transactionDocRef = doc(collection(db, "transactions"), userName);

      // Get the existing data of the user's shopping list
      const transactionDocSnapshot = await getDoc(transactionDocRef);
      let existingData = {};
      if (transactionDocSnapshot.exists()) {
        existingData = transactionDocSnapshot.data();
      }

      // Define the data object to be updated in Firestore
      const newData = {
        totalMoney: existingData.totalMoney || 0,
        items: existingData.items || [],
      };

      // Iterate over the cart items and update quantities and total cost
      cartItems.forEach((cartItem) => {
        const existingItemIndex = newData.items.findIndex(
          (item) => item.itemType === cartItem.beanType
        );
        if (existingItemIndex !== -1) {
          // Item already exists, update quantity and total cost
          newData.items[existingItemIndex].itemCount += cartItem.quantity;
          newData.items[existingItemIndex].itemTotalPrice +=
            cartItem.quantity *
            coffeeBeans.find((bean) => bean.beanType === cartItem.beanType)
              .price;
        } else {
          // Item doesn't exist, add it to the list
          newData.items.push({
            itemType: cartItem.beanType,
            itemCount: cartItem.quantity,
            itemTotalPrice:
              cartItem.quantity *
              coffeeBeans.find((bean) => bean.beanType === cartItem.beanType)
                .price,
          });
        }

        // Update total price
        newData.totalMoney +=
          cartItem.quantity *
          coffeeBeans.find((bean) => bean.beanType === cartItem.beanType).price;
      });

      // Update the document in Firestore with the new data
      await setDoc(transactionDocRef, newData);

      // Optionally, you can reset the quantities and total price after saving
      // setQuantities({});
      console.log("Data saved successfully!");
      // Reload the webpage to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="store_container">
      <div className="store_bg">
        <section className="bean_list">
          {/* Map over the coffeeBeans array and display the data */}
          {coffeeBeans.map((bean, index) => (
            <div key={index} className="bean_item" >
              <div className="bean_info">
                {/* Display relevant data for each coffee bean */}
                <h3>{bean.beanType}</h3>
                <p>Price: NT$ {bean.price} / 0.5 lbs</p>
              </div>
              <div className="bean_actions">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      bean.beanType,
                      quantities[bean.beanType] - 1
                    )
                  }
                  disabled={quantities[bean.beanType] <= 0}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={quantities[bean.beanType]}
                  onChange={(e) =>
                    handleQuantityChange(
                      bean.beanType,
                      parseInt(e.target.value)
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      bean.beanType,
                      quantities[bean.beanType] + 1
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </section>
        <div className="total_price">
          <p>
            Total Price: NT$ {totalPrice}{" "}
            {storedTotalPrice !== 0 && `(+ ${storedTotalPrice})`}
          </p>
          <hr></hr>
        </div>
        <div className="shopping_cart">
          <h3>Shopping Cart</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.beanType}: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
        <hr></hr>
        <div className="order_list">
          <h3>Order Sent</h3>
          <ul>
            {shoppingList.map((item, index) => (
              <li key={index}>
                {item.itemType}: {item.itemCount}
              </li>
            ))}
          </ul>
        </div>
        <div className="store_buttons">
          <button className="save_button" onClick={handleSave}>
            Save
          </button>
          {isAdmin && ( // Render the Export button only if the user is an admin
            <>
              <button className="export_button" onClick={handleExport}>
                Export
              </button>
              <button className="delete_button" onClick={handleDeleteAllDocuments}>
                Clear
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Store;
