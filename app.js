import { courses } from './data.js';

const container = document.getElementById('courses-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal-message');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');

// Sections d'accueil
const aboutSection = document.getElementById('about-site');
const discoverySection = document.getElementById('discovery-world');

// Crée une carte pour Collège, Lycée et LLCER
function createCard(course, niveau) {
    const card = document.createElement('div');
    card.classList.add('course-card');
    card.style.backgroundColor = course.color;
    if (course.locked) card.classList.add('locked');

    const cardTitle = course.axe ? course.axe : course.titre;

    card.innerHTML = `
    <h3>${cardTitle}</h3>
    <p><strong>Type :</strong> ${course.type}</p>
    <p>${course.description}</p>
  `;

    const wrapper = document.createElement('a');

    // IMPORTANT : on garde le niveau dans l'URL
    wrapper.href = `course.html?id=${course.id}&niveau=${encodeURIComponent(niveau)}`;
    wrapper.style.textDecoration = 'none';
    wrapper.appendChild(card);

    if (course.locked) {
        card.addEventListener('click', e => {
            e.preventDefault();
            modalText.textContent = "Ce cours est actuellement verrouillé, car il n'a pas encore été abordé en classe.";
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    }

    return wrapper;
}

// Affiche les cours par catégorie
function displayCourses(niveau = 'Collège') {
    container.innerHTML = '';

    // Afficher/cacher les sections d'accueil
    if (niveau === 'Accueil') {
        if (aboutSection) aboutSection.style.display = 'block';
        if (discoverySection) discoverySection.style.display = 'block';
    } else {
        if (aboutSection) aboutSection.style.display = 'none';
        if (discoverySection) discoverySection.style.display = 'none';
    }

    let filteredCourses = [];

    if (niveau === 'Collège') {
        filteredCourses = courses.filter(c => ['5ème', '4ème', '3ème'].includes(c.niveau));
    }
    else if (niveau === 'Lycée') {
        filteredCourses = courses.filter(c => ['Seconde', 'Première', 'Terminale'].includes(c.niveau));
    }
    else if (niveau === 'LLCER') {
        filteredCourses = courses.filter(c => c.niveau.includes('LLCER'));
    }

    // Collège et Lycée : regroupement par classe puis par programme
    if (niveau === 'Collège' || niveau === 'Lycée') {
        const classes = [...new Set(filteredCourses.map(c => c.niveau))];

        classes.forEach(classe => {
            const classTitle = document.createElement('h2');
            classTitle.textContent = classe;
            container.appendChild(classTitle);

            const classCourses = filteredCourses.filter(c => c.niveau === classe);

            // Séparer cours avec programme et sans programme
            const coursesWithProgramme = classCourses.filter(c => c.programme);
            const coursesWithoutProgramme = classCourses.filter(c => !c.programme);

            // Afficher d'abord les cours sans programme (sans titre)
            if (coursesWithoutProgramme.length > 0) {
                const classDiv = document.createElement('div');
                classDiv.classList.add('courses-grid');

                coursesWithoutProgramme.forEach(c => classDiv.appendChild(createCard(c, niveau)));

                container.appendChild(classDiv);
            }

            // Afficher ensuite les cours avec programme, regroupés
            if (coursesWithProgramme.length > 0) {
                const programmes = [...new Set(coursesWithProgramme.map(c => c.programme))];

                programmes.forEach(programme => {
                    const progTitle = document.createElement('h3');

                    if (programme === "Nouveau") {
                        if (classe === "4ème") progTitle.textContent = "📘 Nouveau programme (rentrée 2027-2028)";
                        else if (classe === "3ème") progTitle.textContent = "📘 Nouveau programme (rentrée 2028-2029)";
                        else progTitle.textContent = "📘 Nouveau programme";
                    }
                    else if (programme === "Ancien") progTitle.textContent = "📙 Ancien programme";
                    else progTitle.textContent = programme;

                    container.appendChild(progTitle);

                    const progDiv = document.createElement('div');
                    progDiv.classList.add('courses-grid');

                    coursesWithProgramme
                        .filter(c => c.programme === programme)
                        .forEach(c => progDiv.appendChild(createCard(c, niveau)));

                    container.appendChild(progDiv);
                });
            }
        });
    }

    // LLCER : regroupement par classe puis par thématique
    if (niveau === 'LLCER') {
        const llcerClasses = [...new Set(filteredCourses.map(c => c.niveau))];

        llcerClasses.forEach(llcerClasse => {
            const classTitle = document.createElement('h2');
            classTitle.textContent = llcerClasse;
            container.appendChild(classTitle);

            const classCourses = filteredCourses.filter(c => c.niveau === llcerClasse);
            const thematiques = [...new Set(classCourses.map(c => c.thématique))];

            thematiques.forEach(theme => {
                const themeTitle = document.createElement('h3');
                themeTitle.textContent = `Thématique : ${theme}`;
                container.appendChild(themeTitle);

                const axeDiv = document.createElement('div');
                axeDiv.classList.add('courses-grid');

                classCourses
                    .filter(c => c.thématique === theme)
                    .forEach(c => axeDiv.appendChild(createCard(c, niveau)));

                container.appendChild(axeDiv);
            });
        });
    }

    // Onglet actif
    filterButtons.forEach(btn => {
        if (btn.dataset.niveau === niveau) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

// Événements sur boutons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        displayCourses(btn.dataset.niveau);

        // Mettre à jour l'URL sans recharger la page
        history.pushState(null, "", `index.html?niveau=${encodeURIComponent(btn.dataset.niveau)}`);
    });
});

// Lire le niveau depuis l'URL au chargement
const params = new URLSearchParams(window.location.search);
const niveauFromUrl = params.get("niveau");

// Affichage par défaut : Accueil sauf si URL précise un niveau
if (niveauFromUrl) {
    displayCourses(niveauFromUrl);
} else {
    displayCourses('Accueil');
}

// Fermeture du modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 250);
});
