// Simulated database of skills highlighting the "Gap" topics, with deep extended data for the drill down
let skills = [
    {
        id: 'git', title: 'Advanced Git Workflow', icon: '🔀', progress: 85,
        description: 'Moving beyond simply committing. Mastery of rebasing, resolving complex merge conflicts, interactive rebasing, and GitHub PR workflows.',
        longDetails: "In academia, a single `git commit -m 'update'` to main was sufficient. In the industry, Git is a collaboration tool. Understanding git flows protects the codebase and creates a traceable history.",
        checklist: [
            { task: "Resolving a 3-way merge conflict", done: true },
            { task: "Interactive rebasing to squash dirty commits", done: true },
            { task: "Writing semantic commit messages", done: false }
        ]
    },
    {
        id: 'testing', title: 'CI/CD & Automations', icon: '🤖', progress: 60,
        description: 'Writing robust unit/integration tests (TDD) and setting up pipelines (GitHub Actions) to automatically run tests before deployment.',
        longDetails: "Code that isn't tested is broken code waiting to happen. Building pipelines to automate testing offloads mental effort onto the machines, ensuring juniors and seniors alike don't break production.",
        checklist: [
            { task: "Writing unit tests with Jest/Vitest", done: true },
            { task: "Configuring a GitHub Action YAML file", done: false },
            { task: "Mocking external API dependencies", done: true }
        ]
    },
    {
        id: 'architecture', title: 'System Architecture', icon: '🏗️', progress: 45,
        description: 'Transitioning from monolithic single-server academic assignments to distributed microservices, load balancing, and API design.',
        longDetails: "A 'Works on My Machine' project doesn't always scale to millions of users. Embracing the constraints and failure points of a distributed system is what defines a Senior Engineer.",
        checklist: [
            { task: "Understanding horizontal vs vertical scaling", done: true },
            { task: "Deploying via Docker Containers", done: false },
            { task: "Implementing an API Gateway", done: false }
        ]
    }
];

// Helper to calculate total overall progress
function updateOverallScore() {
    if (skills.length === 0) return;
    const total = skills.reduce((sum, skill) => sum + parseInt(skill.progress), 0);
    const avg = Math.round(total / skills.length);
    
    // Update SVG Circle path and text
    const circle = document.getElementById('overall-progress-circle');
    const text = document.getElementById('overall-progress-text');
    
    if (circle && text) {
        circle.style.strokeDasharray = `${avg}, 100`;
        text.textContent = `${avg}%`;
    }
    
    // Update skill count text
    const countTag = document.getElementById('total-skills-count');
    if (countTag) countTag.textContent = skills.length;
}

// Render the grid on Dashboard
function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = ''; // Clear for re-renders
    
    skills.forEach(skill => {
        const card = document.createElement('article');
        card.className = 'skill-card glass-panel';
        
        // Tie event listener directly to the card creation
        card.addEventListener('click', () => openDetailView(skill.id));
        
        card.innerHTML = `
            <div class="skill-header">
                <h3>${skill.title}</h3>
                <span class="skill-icon">${skill.icon}</span>
            </div>
            <p class="skill-desc">${skill.description}</p>
            
            <div class="progress-section">
                <div class="progress-label">
                    <span>Proficiency Tracking</span>
                    <span style="color: var(--text-primary)">${skill.progress}%</span>
                </div>
                <div class="progress-container">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Transition trigger
        setTimeout(() => {
            const fill = card.querySelector('.progress-fill');
            fill.style.width = `${skill.progress}%`;
        }, 100);
    });
    
    updateOverallScore();
}

// ==== VIEW ROUTING LOGIC ====
const dashboardView = document.getElementById('main-dashboard');
const detailView = document.getElementById('detail-view');
const detailContentBox = document.getElementById('detail-content-box');

function openDetailView(skillId) {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    // Build the sub-checklist generic HTML
    const checklistHtml = (skill.checklist || []).map(item => `
        <li>
            <div style="font-size: 1.5rem">${item.done ? '✅' : '⏳'}</div>
            <div>
                <strong>${item.task}</strong>
                <span>${item.done ? 'Competency Demonstrated' : 'Learning in progress'}</span>
            </div>
        </li>
    `).join('');

    // Inject the deep HTML
    detailContentBox.innerHTML = `
        <div class="detail-hero">
            <span class="hero-icon">${skill.icon}</span>
            <div class="hero-text">
                <h2>${skill.title}</h2>
                <p class="level-tag">Proficiency: ${skill.progress}%</p>
            </div>
        </div>
        <div style="margin-top: 1rem;">
            <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.1rem; margin-bottom: 2rem;">
                ${skill.longDetails || skill.description}
            </p>
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Sub-Skills Progression Tracker</h3>
            <ul class="checklist">
                ${checklistHtml}
            </ul>
        </div>
    `;

    // Switch view
    dashboardView.style.display = 'none';
    detailView.style.display = 'flex';
}

function showDashboard() {
    detailView.style.display = 'none';
    dashboardView.style.display = 'grid'; // .dashboard uses grid
}

// Attach back button
document.getElementById('back-btn').addEventListener('click', showDashboard);

// ==== FORM SUBMISSION LOGIC ====
document.getElementById('add-skill-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page reload
    
    // Extract values
    const title = document.getElementById('skill-title').value;
    const icon = document.getElementById('skill-icon').value;
    const progress = document.getElementById('skill-progress').value;
    const desc = document.getElementById('skill-desc').value;
    
    // Create new object
    const newSkill = {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title: title,
        icon: icon,
        progress: parseInt(progress),
        description: desc,
        longDetails: "This is a custom-added skill, focused on practical industry application rather than abstract theory.",
        checklist: [
            { task: "Understand core theoretical foundations", done: true },
            { task: "Apply to a practical greenfield project", done: false },
            { task: "Maintain inside a larger production system", done: false }
        ]
    };
    
    // Push and trigger re-render
    skills.push(newSkill);
    renderSkills();
    
    // Reset Form
    e.target.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
});
