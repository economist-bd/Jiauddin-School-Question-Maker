// আপনার প্রদত্ত API KEY
const API_KEY = "AIzaSyAAU6T0N6Tyh6wAgFrgPlzudmKJ6DMqG0Y"; 

async function fetchQuestions() {
    const cls = document.getElementById('classSelect').value;
    const sub = document.getElementById('subjectSelect').value;
    const type = document.getElementById('questionType').value;
    
    // লোডার অন করা
    document.getElementById('loader').style.display = 'block';
    const responseArea = document.getElementById('aiResponseArea');
    responseArea.innerHTML = '<p style="text-align:center; color: #007bff; font-weight:bold;">AI প্রশ্ন জেনারেট করছে... দয়া করে ১০-১৫ সেকেন্ড অপেক্ষা করুন...</p>';

    // হেডার আপডেট
    document.getElementById('dispClass').innerText = cls;
    document.getElementById('dispSub').innerText = sub;
    
    let prompt = "";
    
    // AI এর জন্য কড়া নির্দেশনা (Prompt Engineering)
    if (type === 'mcq') {
        document.getElementById('dispTime').innerText = "সময়: ৩০ মিনিট";
        document.getElementById('dispMarks').innerText = "পূর্ণমান: ৩০";
        
        prompt = `
        You are an expert HSC Exam Question Maker for Bangladesh Board Exams.
        Task: Create a REAL "Model Test Question Paper" for subject: "${sub}", Class: "${cls}".
        Format: 30 Multiple Choice Questions (MCQ).
        
        CRITICAL INSTRUCTIONS:
        1. DO NOT use placeholders like "Question goes here" or "Option A".
        2. GENERATE REAL ACADEMIC QUESTIONS based on the HSC syllabus of Bangladesh.
        3. Create exactly 30 unique questions.
        4. Provide the output in RAW HTML format inside a single <div>.
        5. DO NOT use markdown formatting (no \`\`\`html or **bold**).
        
        HTML STRUCTURE FOR EACH QUESTION:
        <div class="q-item" style="margin-bottom: 10px; page-break-inside: avoid;">
             <div class="q-stem" style="font-weight: bold;">১. [Real Question Text Here?]</div>
             <div class="q-options" style="display: grid; grid-template-columns: 1fr 1fr; margin-left: 20px;">
               <span>(ক) [Real Option]</span> <span>(খ) [Real Option]</span>
               <span>(গ) [Real Option]</span> <span>(ঘ) [Real Option]</span>
             </div>
        </div>
        (Repeat this for 30 questions with correct numbering in Bengali like ১, ২, ৩...)
        `;
        
    } else {
        document.getElementById('dispTime').innerText = "সময়: ২ ঘণ্টা ৩০ মি.";
        document.getElementById('dispMarks').innerText = "পূর্ণমান: ৭০";
        
        prompt = `
        You are an expert HSC Exam Question Maker for Bangladesh Board Exams.
        Task: Create a REAL "Creative Question (Srijonshil) Paper" for subject: "${sub}", Class: "${cls}".
        Format: 11 Creative Questions (CQ).
        
        CRITICAL INSTRUCTIONS:
        1. DO NOT use placeholders. Write REAL Creative Scenarios (Uddipok).
        2. GENERATE REAL ACADEMIC QUESTIONS based on the HSC syllabus.
        3. Create exactly 11 unique Creative Questions.
        4. Provide the output in RAW HTML format inside a single <div>.
        
        HTML STRUCTURE FOR EACH QUESTION:
        <div class="q-item" style="margin-bottom: 30px; page-break-inside: avoid;">
             <div class="q-stem" style="font-weight: bold; margin-bottom: 5px;">
                [Question Number in Bengali]. নিচের উদ্দীপকটি পড় এবং প্রশ্নগুলোর উত্তর দাও:<br>
                "[Write a realistic scenario/paragraph related to ${sub} here]"
             </div>
             <div class="cq-sub" style="margin-left: 20px;">
                (ক) [Knowledge based question]? <span style="float:right">১</span><br>
                (খ) [Comprehension based question]? <span style="float:right">২</span><br>
                (গ) [Application based question]? <span style="float:right">৩</span><br>
                (ঘ) [Higher Order Thinking question]? <span style="float:right">৪</span>
             </div>
        </div>
        (Repeat this for 11 questions with correct numbering in Bengali like ১, ২, ৩...)
        `;
    }

    try {
        const result = await callGemini(prompt);
        // Markdown ক্লিন করা (যদি AI ভুল করে দিয়ে দেয়)
        let cleanHtml = result.replace(/```html/g, '').replace(/```/g, '');
        responseArea.innerHTML = cleanHtml;
    } catch (error) {
        console.error(error);
        responseArea.innerHTML = `<p style="color:red; text-align:center;">ত্রুটি হয়েছে: ${error.message}</p>`;
    } finally {
        document.getElementById('loader').style.display = 'none';
    }
}

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

// কপি ফাংশন - যা Word এ নিলে স্টাইল নষ্ট হবে না
function copyForWord() {
    const headerContent = document.getElementById('headerSection').innerHTML;
    const questionContent = document.getElementById('aiResponseArea').innerHTML;
    
    // একটি অদৃশ্য ডিভ তৈরি করে সেখানে সব কন্টেন্ট রাখা হচ্ছে
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerContent + "<hr>" + questionContent;
    tempDiv.style.fontFamily = "'SutonnyMJ', 'Kalpurush', sans-serif"; // ফন্ট ঠিক রাখা
    
    document.body.appendChild(tempDiv);
    
    const range = document.createRange();
    range.selectNode(tempDiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        document.execCommand('copy');
        alert("সম্পূর্ণ প্রশ্ন কপি হয়েছে! MS Word এ পেস্ট করুন।");
    } catch (err) {
        alert("কপি করতে সমস্যা হয়েছে।");
    }
    
    document.body.removeChild(tempDiv);
    window.getSelection().removeAllRanges();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
