import "core-js/features/map";
import "core-js/features/set";
import 'array-flat-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {StateProvider} from "./state";

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>, document.getElementById("root"));
// if (new URL(window.location.href).searchParams.get('vk_user_id') === process.env.REACT_APP_ID.toString()) {
//   import("./eruda").then(() => {}); //runtime download
// }

// console.log(new URL(window.location.href).searchParams.get('vk_user_id'));
//import("./eruda").then(({ default: eruda }) => {}); //runtime download
