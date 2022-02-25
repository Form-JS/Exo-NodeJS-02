const ReadlinePromise = require('./modules/readline-promise');

// ↓ On souhaite utilise le mot clef "await"
const exo01 = async () => {
    const reader = new ReadlinePromise();

    let stop = false;
    while (!stop) {
        const firstname = await reader.question('Votre prénom');
        const lastname = await reader.question('Votre nom');

        // TODO Save data in file :D 

        const nextValue = await reader.question('Voulez vous continuer (y/N) ?');
        stop = nextValue.toLowerCase() !== 'y';

    }
    reader.close();
};
exo01();