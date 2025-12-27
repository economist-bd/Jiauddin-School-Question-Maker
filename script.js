// আপনার প্রদত্ত API KEY
const API_KEY = "AIzaSyAAU6T0N6Tyh6wAgFrgPlzudmKJ6DMqG0Y"; 

async function fetchQuestions() {
    const cls = document.getElementById('classSelect').value;
    const sub = document.getElementById('subjectSelect').value;
    const type = document.getElementById('questionType').value;
    
    // লোডার অন করা
    document.getElementById('loader').style.display = 'block';
    const responseArea = document.getElementById('aiResponseArea');
    responseArea.innerHTML = '<p style="text-align:center">প্রশ্ন তৈরি হচ্ছে...</p>';

    // হেডার আপডেট
    document.getElementById('dispClass').innerText = cls;
    document.getElementById('dispSub').innerText = sub;
    
    let prompt = "";
    
    // AI এর জন্য প্রম্পট তৈরি (খুবই স্পেসিফিক নির্দেশ)
    if (type === 'mcq') {
        document.getElementById('dispTime').innerText = "সময়: ৩০ মিনিট";
        document.getElementById('dispMarks').innerText = "পূর্ণমান: ৩০";
        
        prompt = `Act as a Bangladeshi HSC Teacher. Create a question paper for:
        Institute: Jiauddin School and College.
        Class: ${cls}, Subject: ${sub}.
        Exam: Model Test-2026.
        Type: 30 MCQ Questions (Full 30 marks).
        Language: Bengali.
        
        IMPORTANT FORMATTING RULES:
        1. Do NOT use markdown (no **bold**, no # headings).
        2. Output only raw HTML code inside a div.
        3. Structure each question like this:
           <div class="q-item">
             <span class="q-stem">১. প্রশ্নের উদ্দীপক বা মূল প্রশ্নটি এখানে লিখুন?</span>
             <div class="q-options">
               <span>(ক) অপশন ১</span><span>(খ) অপশন ২</span>
               <span>(গ) অপশন ৩</span><span>(ঘ) অপশন ৪</span>
             </div>
           </div>
        4. Generate exactly 30 unique and relevant questions.`;
        
    } else {
        document.getElementById('dispTime').innerText = "সময়: ২ ঘণ্টা ৩০ মি.";
        document.getElementById('dispMarks').innerText = "পূর্ণমান: ৭০";
        
        prompt = `Act as a Bangladeshi HSC Teacher. Create a Creative Question (CQ/Srijonshil) paper for:
        Institute: Jiauddin School and College.
        Class: ${cls}, Subject: ${sub}.
        Exam: Model Test-2026.
        Type: 11 Creative Questions (Student answers 7, Total 70 Marks).
        Language: Bengali.
        
        IMPORTANT FORMATTING RULES:
        1. Do NOT use markdown.
        2. Output only raw HTML.
        3. Structure each question like this:
           <div class="q-item" style="margin-bottom: 25px;">
             <span class="q-stem">১. উদ্দীপকটি পড় এবং নিচের প্রশ্নগুলোর উত্তর দাও: <br> [এখানে একটি প্রাসঙ্গিক উদ্দীপক তৈরি করুন]</span>
             <br>
             <span class="cq-sub">(ক) জ্ঞানমূলক প্রশ্ন? <span style="float:right">১</span></span>
             <span class="cq-sub">(খ) অনুধাবনমূলক প্রশ্ন? <span style="float:right">২</span></span>
             <span class="cq-sub">(গ) প্রয়োগমূলক প্রশ্ন? <span style="float:right">৩</span></span>
             <span class="cq-sub">(ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন? <span style="float:right">৪</span></span>
           </div>
        4. Generate exactly 11 creative questions.`;
    }

    try {
        const result = await callGemini(prompt);
        // Markdown কোড ব্লক (```html ... ```) থাকলে সরিয়ে ফেলা
        let cleanHtml = result.replace(/```html/g, '').replace(/```/g, '');
        responseArea.innerHTML = cleanHtml;
    } catch (error) {
        console.error(error);
        responseArea.innerHTML = `<p style="color:red; text-align:center;">ত্রুটি হয়েছে: ${error.message}</p>`;
    } finally {
        document.getElementById('loader').style.display = 'none';
    }
}

// Gemini API কল করার ফাংশন
async function callGemini(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: promptText }]
            }]
        })
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// MS Word এর জন্য ফরম্যাট বজায় রেখে কপি করার ফাংশন
function copyForWord() {
    const content = document.getElementById('paperContent');
    
    // সিলেকশন তৈরি করা
    const range = document.createRange();
    range.selectNode(content);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        // মডার্ন ব্রাউজারে ফরম্যাটেড কপির চেষ্টা
        document.execCommand('copy');
        alert("প্রশ্ন কপি হয়েছে! \nএখন MS Word খুলে Paste (Ctrl+V) করুন।");
    } catch (err) {
        alert("কপি করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি সিলেক্ট করে কপি করুন।");
    }
    
    window.getSelection().removeAllRanges();
}

// Service Worker (Optional for PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
