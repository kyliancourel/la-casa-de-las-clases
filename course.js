import { courses } from './data.js';

const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

const course = courses.find(c => c.id === courseId);

const titleEl = document.getElementById('course-title');
const contentEl = document.getElementById('course-content');
const backBtn = document.getElementById('back-btn');

// Modal message
const modal = document.getElementById('modal-message');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');

function showModalMessage(text) {
    if (!modal || !modalText) return;
    modalText.textContent = text;
    modal.style.display = 'flex';
}

// Fermer le modal au clic sur OK
if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Fermer le modal si on clique en dehors du contenu
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

if (course) {
    // Titre principal : Axe + "Les Séances"
    const axeTitle = course.axe ? course.axe : course.titre;
    titleEl.textContent = `${axeTitle} - Les Séances`;
    document.title = `${axeTitle} - Les Séances`;

    // Bande colorée "Les Séances"
    const bande = document.createElement('div');
    bande.classList.add('bande-color');
    bande.style.backgroundColor = course.color;

    const bandeTitle = document.createElement('h3');
    bandeTitle.textContent = 'Les Séances';
    bandeTitle.style.margin = '0';
    bandeTitle.style.color = '#333';
    bande.appendChild(bandeTitle);
    contentEl.appendChild(bande);

    // Séances
    if (course.seances && course.seances.length > 0) {
        course.seances.forEach(seance => {
            const seanceCard = document.createElement('div');
            seanceCard.classList.add('seance-card');

            // Titre de la séance
            const seanceTitle = document.createElement('h4');
            seanceTitle.textContent = seance.titre;
            seanceCard.appendChild(seanceTitle);

            // Liste des fichiers
            if (seance.fichiers && seance.fichiers.length > 0) {
                const ul = document.createElement('ul');
                ul.classList.add('seance-files');

                seance.fichiers.forEach(f => {
                    const li = document.createElement('li');

                    // Type du fichier
                    const typeTitle = document.createElement('div');
                    typeTitle.textContent = `${f.type}:`;
                    li.appendChild(typeTitle);

                    if (!f.file || f.file === "?") {
                        const unavailable = document.createElement('div');
                        unavailable.textContent = '❓';
                        unavailable.classList.add('unavailable');
                        li.appendChild(unavailable);
                    } else {
                        const fileDiv = document.createElement('div');
                        fileDiv.classList.add('file-item');

                        // Icône selon extension
                        const ext = f.file.split('.').pop().toLowerCase();
                        const iconSpan = document.createElement('span');
                        iconSpan.classList.add('icon');
                        if (ext === 'pdf') iconSpan.classList.add('icon-pdf');
                        else if (ext === 'ppt' || ext === 'pptx') iconSpan.classList.add('icon-ppt');
                        else if (ext === 'doc' || ext === 'docx') iconSpan.classList.add('icon-word');
                        else if (ext === 'xls' || ext === 'xlsx') iconSpan.classList.add('icon-xls');
                        else iconSpan.classList.add('icon-unknown');

                        // Lien fichier
                        const fileLink = document.createElement('a');
                        fileLink.href = f.file;
                        fileLink.target = '_blank';
                        fileLink.textContent = f.file.split('/').pop();
                        fileLink.style.textDecoration = 'none';
                        fileLink.style.color = '#333';
                        fileLink.style.cursor = 'pointer';

                        if (f.locked) {
                            fileLink.addEventListener('click', e => {
                                e.preventDefault();
                                showModalMessage('Ce fichier est verrouillé pour le moment 🔒');
                            });
                            const lockSpan = document.createElement('span');
                            lockSpan.textContent = ' 🔒';
                            lockSpan.classList.add('locked');
                            fileDiv.appendChild(lockSpan);
                        }

                        fileDiv.appendChild(iconSpan);
                        fileDiv.appendChild(fileLink);
                        li.appendChild(fileDiv);
                    }

                    ul.appendChild(li);
                });

                seanceCard.appendChild(ul);
            }

            contentEl.appendChild(seanceCard);
        });
    }

    // Bouton retour
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
}
