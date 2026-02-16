import { courses } from './data.js';

const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');
const niveau = params.get('niveau'); // récupère le niveau cliqué auparavant

const course = courses.find(c => c.id === courseId);

const titleEl = document.getElementById('course-title');
const contentEl = document.getElementById('course-content');
const backBtn = document.getElementById('back-btn');

if (course) {
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

    // Titre du cours
    titleEl.textContent = course.axe ? course.axe : course.titre;

    // Séances
    if (course.seances && course.seances.length > 0) {
        course.seances.forEach(seance => {
            // Vignette
            const seanceCard = document.createElement('div');
            seanceCard.classList.add('seance-card');

            // Titre de la séance
            const seanceTitle = document.createElement('h4');
            seanceTitle.textContent = seance.titre;
            seanceCard.appendChild(seanceTitle);

            // Fichiers
            if (seance.fichiers && seance.fichiers.length > 0) {
                const ul = document.createElement('ul');
                ul.classList.add('seance-files');

                seance.fichiers.forEach(f => {
                    const li = document.createElement('li');

                    const typeTitle = document.createElement('div');
                    typeTitle.textContent = f.type + ':';
                    li.appendChild(typeTitle);

                    if (!f.file || f.file === "?") {
                        const unavailable = document.createElement('div');
                        unavailable.textContent = '❓';
                        unavailable.classList.add('unavailable');
                        li.appendChild(unavailable);
                    } else {
                        const fileDiv = document.createElement('div');
                        fileDiv.classList.add('file-item');

                        const ext = f.file.split('.').pop().toLowerCase();
                        const iconSpan = document.createElement('span');
                        iconSpan.classList.add('icon');
                        if (ext === 'pdf') iconSpan.classList.add('icon-pdf');
                        else if (ext === 'ppt' || ext === 'pptx') iconSpan.classList.add('icon-ppt');
                        else if (ext === 'doc' || ext === 'docx') iconSpan.classList.add('icon-word');
                        else if (ext === 'xls' || ext === 'xlsx') iconSpan.classList.add('icon-xls');
                        else iconSpan.classList.add('icon-unknown');

                        const fileLink = document.createElement('a');
                        fileLink.href = f.file;
                        fileLink.target = '_blank';
                        fileLink.textContent = f.file.split('/').pop();
                        fileLink.style.textDecoration = 'none';
                        fileLink.style.color = '#333';

                        if (f.locked) {
                            fileLink.addEventListener('click', e => {
                                e.preventDefault();
                                alert('Ce fichier est verrouillé pour le moment.');
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

    // --- BOUTON RETOUR : renvoie au niveau cliqué ---
    backBtn.addEventListener('click', () => {
        if (niveau) {
            window.location.href = `index.html?niveau=${encodeURIComponent(niveau)}`;
        } else {
            window.history.back();
        }
    });
}
