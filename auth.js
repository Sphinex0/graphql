import { navigateTo } from "./router.js";

export const authorization = async (info) => {
    const encodedInfo = btoa(info);
    let headersList = {
      "Authorization": `Basic ${encodedInfo}`
    }
  
    let response = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
      method: "POST",
      headers: headersList
    });
    if (response.ok) {
      let data = await response.json();
      localStorage.setItem('authToken', data);
      navigateTo("/")
    }else{
      document.getElementById("error").textContent = " credentials are invalid"
    }
  
  }