import { AuditsRatio, convertXPToReadable, user } from "./data.js";

export function generateXPOverTimeGraph(transactions) {
    if (transactions.length === 0) return;

    // Sort transactions and calculate cumulative XP
    let cumulativeXP = 0;
    const data = transactions.map(tx => {
        cumulativeXP += tx.amount;
        return { date: new Date(tx.time), xp: cumulativeXP, amount: tx.amount };
    });


    // Setup SVG and scaling
    const svg = document.getElementById('xpOverTime');
    const padding = 40;
    const svgWidth = 400 - (padding * 2);
    const svgHeight = 200 - (padding * 2);
    const minTime = data[0].date.getTime();
    const maxTime = data[data.length - 1].date.getTime();
    const timeSpan = maxTime - minTime;

    // Calculate coordinates
    const pointCoords = data.map((d, i) => {

        const x = padding + ((d.date.getTime() - minTime) / timeSpan) * svgWidth;
        const y = padding + svgHeight - (d.xp / user.totalXP) * svgHeight;

        return { x, y, date: d.date, amount: d.amount };
    });






    // Generate polyline points
    const points = pointCoords.map(p => `${p.x},${p.y}`).join(' ');



    // Generate group elements with circles and text
    const elements = pointCoords.map((p, i) => {
        const dateStr = p.date.toLocaleDateString(); // e.g., "2/27/2025"
        const time = `${dateStr}`;
        const xpAmount = `(+${convertXPToReadable(p.amount)})`
        if (i !== 0) {
            return `
            <g class="data-point">
                <circle cx="${p.x}" cy="${p.y}" r="3" fill="orange" stroke="black" />
                <text x="${p.x}" y="${p.y - 30}" fill="black">${time}</text>
                <text x="${p.x}" y="${p.y - 10}" fill="black">${xpAmount}</text>
            </g>
        `;
        } else {
            return `
            <g>
                <circle cx="${p.x}" cy="${p.y}" r="3" fill="blue" />
                <text x="${p.x}" y="${p.y + 30}" fill="black" class="first-time">${time}</text>
                <text x="${p.x}" y="${p.y + 15}" fill="black" class="first-time">${xpAmount}</text>
            </g>
        `;
        }

    }).join('');

    // Combine everything into the SVG
    svg.innerHTML = `
        <polyline points="${points}" stroke="royalblue" stroke-width="3" fill="none" />
        ${elements}
    `;
}


export function generateAuditRatioGraph() {
    const svg = document.getElementById('AuditRatio');

    // Fixed SVG dimensions
    const width = 400;
    const height = 200;

    // Define margins for better layout
    const leftMargin = 10;      // Space for labels on the left
    const rightMargin = 70;     // Space on the right to avoid edge clipping
    const availableWidth = width - leftMargin - rightMargin;

    // Calculate maximum value for scaling, with fallback to avoid division by zero
    const maxValue = Math.max(AuditsRatio.totalDown, AuditsRatio.totalUp, 1);
    const up = AuditsRatio.totalUp > AuditsRatio.totalDown

    // Calculate line lengths proportional to values
    const lineLengthDown = (AuditsRatio.totalDown / maxValue) * availableWidth;
    const lineLengthUp = ((AuditsRatio.totalUp + AuditsRatio.totalUpBonus) / maxValue) * availableWidth;

    // Generate SVG content using template literals
    svg.innerHTML = `
    <!-- Line for totalUp (orange) -->
    <line x1="${leftMargin}" y1="50" x2="${leftMargin + lineLengthUp}" y2="50" stroke="${up ? "orange" : "black"}" stroke-width="10" />

    <!-- Line for totalDown (black) -->
    <line x1="${leftMargin}" y1="100" x2="${leftMargin + lineLengthDown}" y2="100" stroke="${up ? "black" : "orange"}" stroke-width="10" />

    <!-- Labels on the left -->
    <text x="10" y="35" fill="${up ? "orange" : "black"}">Done</text>
    <text x="10" y="85" fill="${up ? "black" : "orange"}">Received</text>

    <!-- Values at the end of the lines -->
    <text x="${leftMargin + lineLengthUp + 5}" y="50" fill="${up ? "orange" : "black"}">${convertXPToReadable(AuditsRatio.totalUp)}</text>
    <text x="${leftMargin + lineLengthUp + 5}" y="75" fill="${up ? "orange" : "black"}">+${convertXPToReadable(AuditsRatio.totalUpBonus)}</text>
    <text x="${leftMargin + lineLengthDown + 5}" y="100" fill="${up ? "black" : "orange"}">${convertXPToReadable(AuditsRatio.totalDown)}</text>
    
    <!-- rotio -->
    <text x="${leftMargin}" y="${height - 10}" fill="orange" font-size="64">${AuditsRatio.auditRatio.toFixed(1)}</text>

`;
}