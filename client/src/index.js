import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import {StateProvider} from "./state";

bridge.subscribe(({detail: {type, data}}) => {
  if (type === 'VKWebAppUpdateConfig') {
    const schemeAttribute = document.createAttribute('scheme');
    schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
    document.body.attributes.setNamedItem(schemeAttribute);
  }
});
// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>, document.getElementById("root"));
if (process.env.NODE_ENV === "development" || new URL(window.location.href).searchParams.get('vk_user_id') === process.env.REACT_ID) {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}

console.log(new URL(window.location.href).searchParams.get('vk_user_id'));
// import("./eruda").then(({ default: eruda }) => {}); //runtime download
