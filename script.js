// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

function generatePaper() {
    // ইনপুট ভ্যালু নেওয়া
    const className = document.getElementById('classSelect').value;
    const subject = document.getElementById('subjectSelect').value;
    const type = document.getElementById('questionType').value;

    // হেডারে তথ্য আপডেট করা
    document.getElementById('displayClass').innerText = className;
    document.getElementById('displaySubject').innerText = subject;

    const questionBody = document.getElementById('questionBody');
    const marksDisplay = document.getElementById('marksDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const instruction = document.getElementById('instruction');

    questionBody.innerHTML = ''; // আগের কন্টেন্ট পরিষ্কার করা

    if (type === 'mcq') {
        // MCQ লজিক
        marksDisplay.innerText = "পূর্ণমান: ৩০";
        timeDisplay.innerText = "সময়: ৩০ মিনিট";
        instruction.innerText = "[দ্রষ্টব্য: প্রতিটি প্রশ্নের মান ১। সকল প্রশ্নের উত্তর দিতে হবে।]";

        // ২ কলামের লেআউট তৈরি
        let contentHTML = '<div style="column-count: 2; column-gap: 40px;">';
        
        for (let i = 1; i <= 30; i++) {
            contentHTML += `
            <div class="question-item" style="break-inside: avoid;">
                <strong>${convertBanglaNum(i)}. প্রশ্ন লিখুন ...................?</strong><br>
                (ক) অপশন &nbsp;&nbsp; (খ) অপশন<br>
                (গ) অপশন &nbsp;&nbsp; (ঘ) অপশন
            </div>`;
        }
        contentHTML += '</div>';
        questionBody.innerHTML = contentHTML;

    } else {
        // CQ (সৃজনশীল) লজিক
        marksDisplay.innerText = "পূর্ণমান: ৭০";
        timeDisplay.innerText = "সময়: ২ ঘণ্টা ৩০ মিনিট";
        instruction.innerText = "[দ্রষ্টব্য: মোট ১১টি প্রশ্ন থাকবে, যে কোনো ৭টির উত্তর দিতে হবে। প্রতিটি প্রশ্নের মান ১০]";

        for (let i = 1; i <= 11; i++) {
            questionBody.innerHTML += `
            <div class="question-item">
                <strong>${convertBanglaNum(i)}. উদ্দীপক লিখুন ....................</strong><br>
                (ক) জ্ঞানমূলক প্রশ্ন? <span style="float:right;">১</span><br>
                (খ) অনুধাবনমূলক প্রশ্ন? <span style="float:right;">২</span><br>
                (গ) প্রয়োগমূলক প্রশ্ন? <span style="float:right;">৩</span><br>
                (ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন? <span style="float:right;">৪</span>
            </div>`;
        }
    }
}

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
function convertBanglaNum(number) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return number.toString().split('').map(digit => banglaDigits[digit]).join('');
}

// কপি করার ফাংশন
function copyToClipboard() {
    const content = document.getElementById('paperContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert('প্রশ্নপত্র কপি হয়েছে! এবার MS Word এ পেস্ট করুন।');
    }).catch(err => {
        console.error('Copy failed', err);
    });
}

// ডিফল্ট পেপার লোড
window.onload = generatePaper;
