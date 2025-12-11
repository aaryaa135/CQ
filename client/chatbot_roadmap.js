document.addEventListener('DOMContentLoaded', () => {
    const stepsContainer = document.getElementById('stepsContainer');

    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderEmpty() {
        stepsContainer.innerHTML = '<p class="muted">No saved roadmaps yet. Create one in the AI Advisor.</p>';
    }

    function loadSavedRoadmaps() {
        fetch('chatbot_roadmap.json')
            .then(response => response.json())
            .then(data => {
                const topics = Object.keys(data || {});
                if (!topics.length) return renderEmpty();

                stepsContainer.innerHTML = '';
                topics.forEach(topic => {
                    const steps = data[topic]; // data[topic] is directly an array of steps
                    const title = topic; // use the key as the title

                    const item = document.createElement('div');
                    item.className = 'saved-roadmap';

                    const header = document.createElement('div');
                    header.className = 'roadmap-header';

                    const toggle = document.createElement('button');
                    toggle.className = 'roadmap-toggle';
                    toggle.type = 'button';
                    toggle.innerHTML = escapeHtml(title);

                    const actions = document.createElement('div');
                    actions.className = 'roadmap-actions';

                    const delBtn = document.createElement('button');
                    delBtn.className = 'roadmap-delete';
                    delBtn.type = 'button';
                    delBtn.title = 'Delete roadmap';
                    delBtn.textContent = 'Delete';

                    actions.appendChild(delBtn);
                    header.appendChild(toggle);
                    header.appendChild(actions);

                    const content = document.createElement('div');
                    content.className = 'roadmap-steps collapsed';

                    if (!steps || !Array.isArray(steps) || !steps.length) {
                        content.innerHTML = '<p class="muted">No steps available.</p>';
                    } else {
                        steps.forEach((step, idx) => {
                            const stepDiv = document.createElement('div');
                            stepDiv.className = 'step';
                            stepDiv.innerHTML = `
                                <div class="step-number">${idx + 1}</div>
                                <div class="step-content">
                                    <h3>${escapeHtml(step.title || '')}</h3>
                                    <p>${escapeHtml(step.advice || '')}</p>
                                </div>
                            `;
                            content.appendChild(stepDiv);
                        });
                    }

                    // toggle expansion - clicking card or toggle button
                    const toggleExpansion = () => {
                        const nowCollapsed = content.classList.toggle('collapsed');
                        toggle.classList.toggle('expanded', !nowCollapsed);
                        header.classList.toggle('expanded', !nowCollapsed);
                        if (!nowCollapsed) {
                            // scrolled into view when expanded
                            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    };

                    toggle.addEventListener('click', toggleExpansion);
                    header.addEventListener('click', (e) => {
                        // Don't toggle if clicking the delete button
                        if (e.target === delBtn || delBtn.contains(e.target)) return;
                        toggleExpansion();
                    });

                    // delete click
                    delBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (!confirm(`Delete roadmap "${title}"?`)) return;
                        fetch('/clear', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ topic })
                        })
                        .then(r => r.json())
                        .then(resp => {
                            const ok = resp && (resp.success || resp.ok || resp === true);
                            if (ok) {
                                item.remove();
                                if (!stepsContainer.querySelectorAll('.saved-roadmap').length) renderEmpty();
                            } else {
                                alert('Failed to delete roadmap.');
                            }
                        })
                        .catch(err => {
                            console.error('Error deleting roadmap:', err);
                            alert('Error deleting roadmap.');
                        });
                    });

                    item.appendChild(header);
                    item.appendChild(content);
                    stepsContainer.appendChild(item);
                });
            })
            .catch(err => {
                console.error('Error loading roadmaps:', err);
                stepsContainer.innerHTML = '<p class="muted">Failed to load saved roadmaps.</p>';
            });
    }

    loadSavedRoadmaps();
});
