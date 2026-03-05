const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await result.json();
    if (data.models) {
        console.log(data.models.map(m => m.name).filter(n => n.includes('gemini')));
    } else {
        console.log(data);
    }
}
run();
