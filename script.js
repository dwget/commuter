const fonts = [
    'Unbounded', 'Oswald', 'Playfair Display', 'JetBrains Mono', 'Rubik Mono One', 'PT Serif',
    'Impact', 'Courier New', 'Arial Black', 'Times New Roman', 'Fixedsys', 'Lucida Console'
];

const asciiArtBlocks = [
    `      .---.
     /     \\

    |  (X)  |
   =============
   || ___ ___ ||
   |||   |   |||
   |||___|___|||
   ||         ||
  ==============`,
    `         ┼
        _|_
       (_|_)
         |
      .-'-'-.
     /       \\

    |   (O)   |
     \\       /
      '-...-'`,
    `     .-''''-.
    /  _  _  \\

   |  (o)(o)  |
   |   \\  /   |
    \\  ====  /
     '------'`,
    `  ◄◄▓▓████████▓▓►►
  ◄▓▒░  MORTAL  ░▒▓►
  ◄▓▒░  DIVINE  ░▒▓►
  ◄◄▓▓████████▓▓►►`,
    `   _____     _____

  |_____|   |_____|
   |   |     |   |
   |   |     |   |
   |   |     |   |
  |_____|   |_____|`
];

const dynamicBehaviors = ['buzz', 'glitch-x', 'smooth', 'spiral-block', 'static'];
const chaoticWords = []; 
let mouseX = 0, mouseY = 0;
let globalWordsArray = [];

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Загрузка слов строго из вашего личного файла lib.txt
async function loadAllDictionaries() {
    try {
        const response = await fetch('lib.txt');
        const textData = await response.text();

        if (!textData.trim()) throw new Error("Файл lib.txt пуст");

        // Режем текст на массив отдельных слов
        globalWordsArray = textData
            .split(/[\s\n\r]+/)
            .map(word => word.trim())
            .filter(word => word.length > 0);

        console.log(`[СИСТЕМА]: Пул собран из lib.txt. Слов: ${globalWordsArray.length}`);
    } catch (error) {
        console.error("[ОШИБКА]: lib.txt не загружен. Включен резерв:", error);
        globalWordsArray = ["VOID", "TERMINAL", "COIL", "MORTAL", "DIVINE", "FUTURE", "LEAKS", "FIXED", "QUESTION", "ANSWER"];
    }
}

// Генератор 20 000 слов с барочным хаосом интервалов и шрифтов
function generateMassiveHTMLText() {
    let rawWords = globalWordsArray;
    let totalWordsGenerated = 0;
    let htmlContent = "";
    let blockCounter = 0;
    const emDash = "—"; // Самое длинное тире

    while (totalWordsGenerated < 20000) {
        if (blockCounter % 6 === 0) {
            const ascii = asciiArtBlocks[Math.floor(Math.random() * asciiArtBlocks.length)];
            htmlContent += `<pre class="ascii-divider">${ascii}</pre>`;
        }

        const paragraphWordsCount = Math.floor(Math.random() * 40) + 30; 
        let paragraphText = [];

        for (let i = 0; i < paragraphWordsCount; i++) {
            paragraphText.push(rawWords[Math.floor(Math.random() * rawWords.length)]);
        }

        totalWordsGenerated += paragraphWordsCount;
        const behavior = dynamicBehaviors[Math.floor(Math.random() * dynamicBehaviors.length)];
        
        // Экстремальные интервалы абзацев
        let paragraphLineHeight = "1.8";
        let paragraphLetterSpacing = "normal";
        const randLayout = Math.random();
        const isNoSpacesPattern = Math.random() < 0.15; // 15% монолитных строк без пробелов

        if (isNoSpacesPattern) {
            paragraphLetterSpacing = "-0.02em";
            paragraphLineHeight = "1.4";
        } else if (randLayout < 0.15) {
            paragraphLineHeight = "0.4"; // Нахлест строк
            paragraphLetterSpacing = "-0.12em";
        } else if (randLayout < 0.25) {
            paragraphLineHeight = "4.0"; // Огромный разряд
            paragraphLetterSpacing = "0.45em";
        } else if (randLayout < 0.35) {
            paragraphLetterSpacing = "-0.07em";
            paragraphLineHeight = "1.1";
        }

        const styledWords = paragraphText.map((word, index) => {
            const font = fonts[Math.floor(Math.random() * fonts.length)];
            
            // Размеры: редкие макро (90-150px) и микро (6-10px) вспышки
            let size = Math.floor(Math.random() * 16) + 14; 
            const randSize = Math.random();
            if (randSize > 0.97) {
                size = Math.floor(Math.random() * 60) + 90;  
            } else if (randSize < 0.04) {
                size = Math.floor(Math.random() * 4) + 6;    
            }
            
            const randomRotation = (Math.random() - 0.5) * 5; 
            const randomYShift = (Math.random() - 0.5) * 6;   
            const randomDelay = (Math.random() * 2).toFixed(2); 
            const randomColor = Math.random() > 0.93 ? (Math.random() > 0.5 ? '#ff0055' : '#00ffcc') : '#111111';

            const isChaotic = Math.random() < 0.30;
            const chaoticClass = isChaotic ? 'chaotic' : '';

            let nodeHtml = `<span class="word-node ${chaoticClass}" style="
                font-family: ${font}, sans-serif; 
                font-size: ${size}px; 
                color: ${randomColor};
                transform: translateY(${randomYShift}px) rotate(${randomRotation}deg);
                --rand-delay: ${randomDelay}s;
            ">${word}</span>`;

            if (isNoSpacesPattern && index < paragraphText.length - 1) {
                const dashFont = fonts[Math.floor(Math.random() * fonts.length)];
                nodeHtml += `<span class="word-node" style="font-family: ${dashFont}, sans-serif; font-size: ${size}px; color: #111111;">${emDash}</span>`;
            }

            if (!isNoSpacesPattern && Math.random() > 0.92 && index < paragraphText.length - 1) {
                nodeHtml += ` ${emDash} `;
            }

            return nodeHtml;
        }).join(isNoSpacesPattern ? "" : " ");

        htmlContent += `<p class="text-block" data-behavior="${behavior}" style="line-height: ${paragraphLineHeight}; letter-spacing: ${paragraphLetterSpacing};">${styledWords}</p>`;
        blockCounter++;
    }

    return htmlContent;
}

function initScrollTriggers() {
    const blocks = document.querySelectorAll('.text-block, .ascii-divider');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(entry.target.className.includes('ascii') ? 'active-ascii' : `effect-${entry.target.getAttribute('data-behavior')}`);
            }
        });
    }, { root: null, threshold: 0.01 });

    blocks.forEach(block => observer.observe(block));
}

// Поведение 30% слов под мышкой (магнитится, глитчит, но остается 100% контрастным)
function updateChaoticWords() {
    chaoticWords.forEach(w => {
        const rect = w.element.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;

        const distX = mouseX - wordX;
        const distY = mouseY - wordY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 180 && distance > 1) {
            const force = (180 - distance) / 180; 
            w.offsetX += (distX * 0.22 * force - w.offsetX) * 0.12;
            w.offsetY += (distY * 0.22 * force - w.offsetY) * 0.12;
            const tremble = (Math.random() - 0.5) * 4;
            
            w.element.style.transform = `translate(${w.offsetX + tremble}px, ${w.offsetY + tremble}px) scale(1.08)`;
            w.element.style.opacity = '1'; 
            w.element.style.color = Math.random() > 0.5 ? '#ff0055' : '#00ffcc';
            w.element.style.zIndex = '999';
        } else {
            w.offsetX += (0 - w.offsetX) * 0.08;
            w.offsetY += (0 - w.offsetY) * 0.08;
            w.element.style.transform = `translate(${w.offsetX}px, ${w.offsetY}px)`;
            w.element.style.opacity = '1';
            w.element.style.color = w.element.style.borderColor || '#111111';
            w.element.style.zIndex = 'auto';
        }
    });

    requestAnimationFrame(updateChaoticWords);
}

async function startEngine() {
    document.getElementById('overlay').style.opacity = '0';
    setTimeout(() => document.getElementById('overlay').style.display = 'none', 500);

    await loadAllDictionaries();

    const container = document.createElement('div');
    container.id = 'textContainer';
    container.innerHTML = generateMassiveHTMLText();
    document.body.appendChild(container);

    document.querySelectorAll('.word-node.chaotic').forEach(node => {
        chaoticWords.push({ element: node, offsetX: 0, offsetY: 0 });
    });

    initScrollTriggers();
    requestAnimationFrame(updateChaoticWords);
}
