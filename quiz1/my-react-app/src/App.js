import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    email: "",
    password: "",
    age: 0,
    firstName: "",
    lastName: "",
    admin: false,
  });
  const [user, setUser] = useState({ loggedIn: false, token: "" });
  const [recipes, setRecipes] = useState([]);
  const [recipeForm, setRecipeForm] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [ingredientForm, setIngredientForm] = useState({});

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const signupSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/signUp",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/login",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
      if (res.data.token) setUser({ loggedIn: true, token: res.data.token });
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  useEffect(() => {
    if (user.loggedIn && user.token !== "") {
      getRecipes();
      getIngredients();
    }
  }, [user]);

  const getRecipes = async () => {
    try {
      const res = await axios({
        url: "http://localhost:5600/recipe/getRecipe",
        method: "post",
        data: { email: data.email },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRecipes(res.data.data);
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const getIngredients = async () => {
    try {
      const res = await axios({
        url: "http://localhost:5600/ingredient/getIngredients",
        method: "get",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setIngredients(res.data.data);
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const handleAddRecipeForm = (e) =>
    setRecipeForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addRecipe = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/recipe/addRecipe",
        method: "post",
        data: { ...recipeForm, email: data.email },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.msg === "Recipe Added") getRecipes();
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const handleAddIngredientForm = (e) =>
    setIngredientForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addIngredient = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/ingredient/addIngredients",
        method: "post",
        data: ingredientForm,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.msg === "Ingredient Added") getIngredients();
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  return (
    <div className="mera-dabba">
      {user.loggedIn ? (
        <div style={{ margin: 50, display: "flex" }}>
          <div style={{ marginRight: 10 }}>
            {recipes.length > 0 ? (
              <div>
                <h1>Your recipes. Click to delete</h1>
                <ul>
                  {recipes.map((recipe) => (
                    <li
                      key={recipe._id}
                      onClick={async () => {
                        try {
                          const res = await axios({
                            url: "http://localhost:5600/recipe/deleteRecipe",
                            method: "post",
                            data: { name: recipe.name },
                            headers: { Authorization: `Bearer ${user.token}` },
                          });
                          if (res.data.msg === "RECIPE DELETED") getRecipes();
                        } catch (e) {
                          console.error(e);
                          window.alert("ERROR");
                        }
                      }}
                    >
                      {recipe.name} - {recipe.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h1>NO RECIPES FOUND</h1>
            )}

            {ingredients.length > 0 ? (
              <div>
                <h1>Your ingredients. Click to delete</h1>
                <ul>
                  {ingredients.map((ingredient) => (
                    <li
                      key={ingredient._id}
                      onClick={async () => {
                        try {
                          const res = await axios({
                            url: "http://localhost:5600/ingredient/deleteByName",
                            method: "post",
                            data: { name: ingredient.name },
                            headers: { Authorization: `Bearer ${user.token}` },
                          });
                          if (res.data.msg === "INGREDIENT DELETED") getIngredients();
                        } catch (e) {
                          console.error(e);
                          window.alert("ERROR");
                        }
                      }}
                    >
                      {ingredient.name} - {ingredient.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h1>NO INGREDIENTS FOUND</h1>
            )}
          </div>
          <div>
            <form
              onSubmit={addRecipe}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Add Recipe</h1>
              <input
                type="text"
                name="name"
                value={recipeForm.name || ""}
                onChange={handleAddRecipeForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="description"
                value={recipeForm.description || ""}
                onChange={handleAddRecipeForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>

            <form
              onSubmit={addIngredient}
              style={{ display: "flex", flexDirection: "column", marginTop: 20 }}
            >
              <h1>Add Ingredient</h1>
              <input
                type="text"
                name="name"
                value={ingredientForm.name || ""}
                onChange={handleAddIngredientForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="description"
                value={ingredientForm.description || ""}
                onChange={handleAddIngredientForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div style={{ margin: 50 }}>
            <form
              onSubmit={signupSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Signup</h1>
              <input
                type="text"
                name="firstName"
                value={data.firstName}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="lastName"
                value={data.lastName}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="number"
                name="age"
                value={data.age}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="checkbox"
                name="admin"
                value={data.admin}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <form
              onSubmit={loginSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Login</h1>
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
