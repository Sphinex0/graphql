// Define routes with path keys and corresponding view functions

import { $404, HOME, LOGIN  } from "./components.js";
import { fetchData, user, XPOverTime } from "./data.js";
import { generateAuditRatioGraph, generateXPOverTimeGraph } from "./graph.js";

export const container = document.getElementById("app")
const routes = {
    '/': async() => {
        container.innerHTML = HOME.html;
        HOME.event()
        await fetchData()  
        generateXPOverTimeGraph(XPOverTime)  
        generateAuditRatioGraph()
        console.log(user)
            
    },
    '/login': () => {
        if (localStorage.getItem('authToken')) {
            navigateTo("/")
        } else {
            container.innerHTML = LOGIN.html;
            LOGIN.event()
        }
    },
    '/404':()=>{
        container.innerHTML = $404.html;
        $404.event()
    }
};

// Router function to handle navigation based on the current path
function router() {
    // Get the current path from the URL
    let path = window.location.pathname;
    // Select the view function, default to home if path isn't found
    const viewFunction = routes[path] || routes['/404'];
    viewFunction();
}

// Function to navigate to a new path and update the history
export function navigateTo(path) {
    // Push the new state to the history without reloading the page
    window.history.pushState({}, '', path);
    // Update the view
    router();
}

// Event listener for back/forward navigation
window.addEventListener('popstate', router);

// Event listener for initial page load
window.addEventListener('load', router);
