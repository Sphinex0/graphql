import { QUERY } from "./query.js";
import { navigateTo } from "./router.js";

export let AuditsRatio
export let XPOverTime
export let skills
export let user


export const parseResponse = (responseData) => {
    // Extract the data object
    const data = responseData.data;

    // Parse user data (always one user)
    const userRaw = data.user[0];
    user = {
        email: userRaw.email,
        lastName: userRaw.lastName,
        firstName: userRaw.firstName,
        login: userRaw.login,
        totalXP: userRaw.xp.aggregate.sum.amount, // Default to 0 if null
        level: userRaw.level.length > 0 ? userRaw.level[0].amount : null // Null if no level
    };

    // Parse skills data
    skills = data.skills.map(skill => ({
        type: skill.type.replace(/^skill_/, '').replace(/-/g, ' '),
        maxAmount: skill.transaction_type.transactions_aggregate.aggregate.max.amount || 0 // Default to 0 if null
    }));
    XPOverTime = data.XPOverTime.map((xp) => ({
        amount: xp.amount,
        time: xp.createdAt ? new Date(xp.createdAt) : new Date(),
    }));

    AuditsRatio = data.AuditsRatio[0];
    document.querySelector(".info").innerHTML = /*html */`
    <h1 id="firstName">${user.firstName} ${user.lastName}</h1>
    <p id="level">${user.level}</p>
    <p id="login">#${user.login}</p>
    <p id="email">${user.email}</p>
    <p id="totalXP">${convertXPToReadable(user.totalXP)}</p>
    <div id="skills">
    ${skills.map(skill => `<p>${skill.type} ${skill.maxAmount}%<span class="progress" style="width:${skill.maxAmount}%;"></span><span class="back-progress" style="width:${skill.maxAmount}%;"></span></p>`).join('')}
    </div>

    `

}

export const fetchData = async () => {

    let headersList = {
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
        "Content-Type": "application/json"
    }
    let response = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ query: QUERY })
    });
    if (response.ok) {
        let data = await response.json();
        if (data.errors) {
            localStorage.removeItem('authToken')
            navigateTo("/login")
            return
        }
        // Parse the response
        parseResponse(data);

        // Display the results
        console.log("User Information:");
        console.log({ user, XPOverTime, skills, AuditsRatio });
    }

}

export function convertXPToReadable(xp) {
    if (xp < 1000) {
        return `${xp} B`;
    } else if (xp < 1000000) {
        const kb = (xp / 1000).toFixed(2);
        return `${kb} KB`;
    } else {
        const mb = (xp / 1000000).toFixed(2);
        return `${mb} MB`;
    }
}