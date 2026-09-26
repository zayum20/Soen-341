// Interactive Skills Tag Handling & Form Submission for Edit Profile

document.addEventListener('DOMContentLoaded', () => {
    const skillInput = document.getElementById('skill-input');
    const addSkillBtn = document.getElementById('add-skill-btn');
    const skillsContainer = document.getElementById('skills-container');
    const skillsHidden = document.getElementById('skills-hidden');
    const editForm = document.querySelector('.edit-form');

    // Load any existing skills from localStorage if available
    const savedSkills = localStorage.getItem('userSkills');
    if (savedSkills) {
        try {
            const parsed = JSON.parse(savedSkills);
            if (Array.isArray(parsed) && parsed.length > 0) {
                skillsContainer.innerHTML = '';
                parsed.forEach(skill => createSkillChip(skill));
                updateHiddenInput();
            }
        } catch (e) {
            console.error('Error loading skills from localStorage:', e);
        }
    }

    // Function to create a new skill chip badge
    function createSkillChip(skillName) {
        const chip = document.createElement('span');
        chip.className = 'skill-chip';
        chip.textContent = skillName + ' ';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'chip-remove';
        removeBtn.setAttribute('aria-label', `Remove ${skillName}`);
        removeBtn.innerHTML = '&times;';

        removeBtn.addEventListener('click', () => {
            chip.remove();
            updateHiddenInput();
        });

        chip.appendChild(removeBtn);
        skillsContainer.appendChild(chip);
    }

    // Get current list of skills from the container
    function getCurrentSkills() {
        const chips = skillsContainer.querySelectorAll('.skill-chip');
        return Array.from(chips).map(chip => {
            return chip.childNodes[0].textContent.trim();
        });
    }

    // Sync hidden input for future backend form submissions
    function updateHiddenInput() {
        const skills = getCurrentSkills();
        skillsHidden.value = skills.join(', ');
    }

    // Add skill action
    function addSkill() {
        const val = skillInput.value.trim();
        if (!val) return;

        const currentSkills = getCurrentSkills();
        // Prevent duplicate skills (case-insensitive)
        const isDuplicate = currentSkills.some(s => s.toLowerCase() === val.toLowerCase());
        if (!isDuplicate) {
            createSkillChip(val);
            updateHiddenInput();
        }

        skillInput.value = '';
        skillInput.focus();
    }

    // Click on '+ Add' button
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addSkill();
        });
    }

    // Press 'Enter' in skill input field
    if (skillInput) {
        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }

    // Existing chips: bind remove event listeners
    skillsContainer.querySelectorAll('.chip-remove').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.skill-chip').remove();
            updateHiddenInput();
        });
    });

    // Form submission: sync hidden input, update localStorage, and cooperatively handle backend
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            // 1. Ensure hidden input has the latest skills so any backend code receives it
            updateHiddenInput();

            // 2. Save skills to localStorage for instant client-side preview
            const skills = getCurrentSkills();
            localStorage.setItem('userSkills', JSON.stringify(skills));

            // 3. If no backend action is defined yet, handle locally so your preview works.
            // If your partner adds action="/api/profile" or uses fetch(), it won't be blocked.
            const hasBackendAction = editForm.hasAttribute('action') && editForm.getAttribute('action') !== '#' && editForm.getAttribute('action') !== '';
            
            if (!hasBackendAction) {
                e.preventDefault();

                const profileData = {
                    firstName: document.getElementById('firstName')?.value || '',
                    lastName: document.getElementById('lastName')?.value || '',
                    email: document.getElementById('email')?.value || '',
                    number: document.getElementById('number')?.value || '',
                    location: document.getElementById('location')?.value || '',
                    status: document.getElementById('status')?.value || 'Job Seeker',
                    about: document.getElementById('about')?.value || '',
                    skills: skills
                };
                localStorage.setItem('userProfileData', JSON.stringify(profileData));

                window.location.href = 'Profile.html';
            }
        });
    }
});

