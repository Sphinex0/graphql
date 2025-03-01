import { authorization } from "./auth.js"
import { navigateTo } from "./router.js"

export const LOGIN = {
  html: /*html*/`
        <div id="loginView">
        <div class="centerLogin">
            <h1>Login</h1>
            <form id="loginForm">
                <input type="text" id="username" placeholder="Username or Email" required>
                <input type="password" id="password" placeholder="Password" required>
                <p id="error" style="color: red;"></p>
                <button type="submit">Login</button>
            </form>
            </div>
        </div>
`,
  event: () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      await authorization(`${username}:${password}`);
    };
  }
}

export const HOME = {
  html: /*html*/ `
          <div id="profileView" >
                      
                      <button id="logoutButton"></button>
                      <div class="grid">
                          <div class="info">
                              <h2>Profile</h2>

                          </div>
                          <div class="graphs">
                              <h2>Statistics</h2>
                              <h3>XP progression</h3>
                              <svg id="xpOverTime" width="400" height="200" viewBox="0 0 400 200"></svg>
                              <h3>Audits ratio</h3>
                              <svg id="AuditRatio" width="400" height="200" viewBox="0 0 400 200"></svg>
                          </div>
                      </div>
                  </div>
              </div>
          `,
  event: () => {
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem('authToken');
      navigateTo("/login");
    });
  }
}

export const $404 = {
  html: /*html */`
      <div id="ErrorView" >
          <div class="ErrorCtn">
              <h1>404 | NOT FOUND</h1>
              <button class="back-btn">BACK</button>
          </div>
      </div>
    </div>
    </div>
  `,
  event: () => {
    document.querySelector(".back-btn").onclick = ()=>{
      navigateTo("/")
    }
  }
}



