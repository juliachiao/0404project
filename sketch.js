// --- 1. 全域變數設定 ---
let currentState = "MAIN_MENU";
let selectedCourse = null; 
let showNotice = false; 
let bgImg; 

// 顏色系統
let primaryCol = "#2c3e50"; 
let accentCol = "#3498db";  
let progressCol = "#2ecc71"; 
let cardCol = "rgba(255, 255, 255, 0.95)";

let buttons = [];
let particles = [];

// 模擬學員資料
let userData = {
    name: "小誠",
    department: "研發部",
    progress: 0.35 
};

// 每日微知識
const dailyTips = [
    "提醒：定期更新密碼，並避免使用生日或連續數字。",
    "提醒：公務信件請務必核對寄件者地址。",
    "提醒：使用 AI 工具請勿輸入公司機密資料。",
    "提醒：密碼應包含大小寫字母與特殊符號。",
    "提醒：AI 產出的內容，發佈前一定要人工校對。"
];
let currentTip = "";

const supervisorCourses = ["1. 職場霸凌(職場不法侵害)預防舉措", "2. 職場性騷擾防治-主管篇"];
const employeeCourses = ["1. 精誠集團AI使用管理辦法", "2. 個資管理與實務", "3. 資訊安全通識", "4. 職業安全衛生"];

// --- 2. 資源預載與初始化 ---
function preload() {
    bgImg = loadImage('bg.jpg', 
        () => console.log("背景圖載入成功"), 
        () => console.error("背景圖載入失敗")
    );
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    for (let i = 0; i < 5; i++) particles.push(new DecoParticle());
    currentTip = random(dailyTips);
    createMainButtons();
}

// --- 3. 主要繪製邏輯 ---
function draw() {
    if (bgImg && bgImg.width > 0) {
        image(bgImg, 0, 0, width, height);
        fill(240, 244, 248, 180); 
        noStroke();
        rectMode(CORNER);
        rect(0, 0, width, height);
    } else {
        background("#f0f4f8");
    }

    for (let p of particles) { p.update(); p.display(); }
    
    drawHeader();

    if (currentState === "MAIN_MENU") {
        drawMainMenu();
        drawDailyTip();    
        drawNoticeButton(); 
    } else if (currentState === "SUPERVISOR_MENU") {
        drawCourseMenu("主管進階課程", supervisorCourses);
    } else if (currentState === "EMPLOYEE_MENU") {
        drawCourseMenu("新進人員必修課程", employeeCourses);
    }

    if (selectedCourse) drawCourseDetail();
    if (showNotice) drawNoticeBoard(); 
}

// --- 4. UI 元件繪製 ---

function drawHeader() {
    push();
    rectMode(CORNER);
    noStroke();
    fill(0, 20);
    rect(0, 5, width, 75); 
    fill(accentCol); 
    stroke("#2980b9");
    strokeWeight(1);
    rect(0, 0, width, 75); 

    let logoX = 50;
    let logoY = 37.5;
    noStroke();
    fill(255);
    ellipse(logoX, logoY, 35, 35);
    fill(accentCol);
    textSize(22);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("S", logoX, logoY + 1); 
    
    textAlign(LEFT, CENTER);
    fill(255); 
    textSize(22);
    textStyle(BOLD);
    text("精誠集團", logoX + 35, logoY - 10);
    textSize(14);
    textStyle(NORMAL);
    fill("rgba(255, 255, 255, 0.8)");
    text("職場法律與安全互動課程平台", logoX + 35, logoY + 15);
    
    if (currentState !== "MAIN_MENU") {
        drawUserDashboard(width - 260, 37.5);
    }
    pop();
}

function drawUserDashboard(x, y) {
    stroke("rgba(255, 255, 255, 0.3)");
    line(x - 20, 15, x - 20, 60);
    noStroke();
    textAlign(LEFT, CENTER);
    fill(255);
    textSize(16);
    textStyle(BOLD);
    text("學員：" + userData.name, x, y - 10);
    textSize(12);
    fill("rgba(255, 255, 255, 0.9)");
    text("部門：" + userData.department, x, y + 12);

    let barW = 120, barH = 8, barX = x + 80;
    fill("rgba(0, 0, 0, 0.2)"); 
    rectMode(LEFT);
    rect(barX, y - 2, barW, barH, 5);
    fill(progressCol); 
    rect(barX, y - 2, barW * userData.progress, barH, 5);
    fill(255);
    textSize(11);
    textAlign(CENTER, CENTER);
    text(floor(userData.progress * 100) + "%", barX + barW + 15, y - 1);
}

function drawDailyTip() {
    push();
    let boxW = 380, boxH = 70;
    let x = width - boxW - 30;
    let y = height - boxH - 30;
    fill(255, 255, 255, 230);
    stroke(accentCol);
    strokeWeight(1);
    rectMode(CORNER);
    rect(x, y, boxW, boxH, 15);
    fill(accentCol);
    noStroke();
    ellipse(x + 35, y + 35, 45, 45);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);
    text("💡", x + 35, y + 37);
    textAlign(LEFT, CENTER);
    fill(primaryCol);
    textSize(15);
    text(currentTip, x + 70, y + 35);
    pop();
}

function drawNoticeButton() {
    let x = width / 2;
    let y = 125;
    let hov = dist(mouseX, mouseY, x, y) < 25;
    fill(hov ? "#f39c12" : "#e67e22"); 
    noStroke();
    ellipse(x, y, 50, 50);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);
    text("📢", x, y);
    textSize(12);
    fill(primaryCol);
    text("系統公告", x, y + 40);
    if (hov) cursor(HAND);
}

// ★★★ 公告欄：列點格式優化版本 ★★★
function drawNoticeBoard() {
    push();
    rectMode(CORNER);
    fill(0, 150);
    noStroke();
    rect(0, 0, width, height);

    let mW = 540; // 寬度適度增加
    let mH = 400; 
    let startX = width / 2 - mW / 2;
    let startY = height / 2 - mH / 2;
    
    fill(255);
    rect(startX, startY, mW, mH, 15);

    // 標題
    textAlign(CENTER, CENTER);
    fill(primaryCol);
    textSize(24);
    textStyle(BOLD);
    text("📢 學習流程須知", width / 2, startY + 50);
    
    // 裝飾線
    stroke(accentCol + "33"); 
    strokeWeight(1);
    line(startX + 40, startY + 85, startX + mW - 40, startY + 85);

    // 正文內容 (列點式)
    noStroke();
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(16);
    fill(primaryCol);
    
    let padding = 45;
    let textX = startX + padding;
    let textY = startY + 110;
    let textW = mW - (padding * 2);

    // 逐點繪製以控制行距與美觀
    let bulletPoints = [
        "1. 【單元學習】：學員須完整觀看單元情境影片，並完成課後小測驗以驗證成效。",
        "2. 【測驗開啟】：完成所有單元小測驗後，可解鎖最終綜合測驗，請務必完成以確保學習成效。",
        "3. 【結訓標準】：進度條將隨合格狀況連動，請務必確認達成 100% 以獲得結訓證書。",
        "4. 【注意事項】：測驗過程中請勿重新整理頁面，以免進度遺失；如遇技術問題請聯繫 IT 支援團隊協助處理。"
    ];

    textWrap(CHAR);
    for (let i = 0; i < bulletPoints.length; i++) {
        text(bulletPoints[i], textX, textY + (i * 55), textW);
    }

    // 按鈕
    let btnW = 160;
    let btnH = 45;
    let btnX = width / 2 - btnW / 2;
    let btnY = startY + mH - 70;
    
    let isHov = mouseX > width/2 - btnW/2 && mouseX < width/2 + btnW/2 && 
                mouseY > btnY && mouseY < btnY + btnH;
    
    fill(isHov ? "#2980b9" : accentCol);
    rect(btnX, btnY, btnW, btnH, 8);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("確認並關閉", width / 2, btnY + btnH / 2);
    
    if (isHov) cursor(HAND);
    pop();
}

// --- 5. 選單與按鈕繪製 ---

function drawMainMenu() {
    push();
    textAlign(CENTER, CENTER);
    fill(primaryCol);
    textSize(32);
    textStyle(BOLD);
    text("請選擇您的學習身分", width / 2, height * 0.35);
    for (let btn of buttons) btn.display();
    pop();
}

function drawCourseMenu(title, courses) {
    push();
    textAlign(CENTER, CENTER);
    fill(primaryCol);
    textSize(28);
    textStyle(BOLD);
    text(title, width/2, height * 0.25);
    let startY = height * 0.35;
    for (let i = 0; i < courses.length; i++) {
        drawCourseCard(width/2, startY + i * 105, 550, 80, courses[i]);
    }
    drawBackButton();
    pop();
}

function drawCourseCard(x, y, w, h, label) {
    let isHover = (mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2);
    push();
    translate(x, y);
    rectMode(CENTER);
    if (isHover && !selectedCourse && !showNotice) {
        scale(1.02); stroke(accentCol); strokeWeight(2); fill(255); cursor(HAND);
    } else {
        stroke("#d1d9e0"); strokeWeight(1); fill(cardCol);
    }
    rect(0, 0, w, h, 15);
    fill(accentCol); noStroke(); ellipse(-w/2 + 30, 0, 12, 12);
    fill(primaryCol); textAlign(LEFT, CENTER); textSize(18); text(label, -w/2 + 60, 0);
    pop();
}

function drawCourseDetail() {
    push();
    fill(0, 150); rectMode(CORNER); rect(0, 0, width, height);
    fill(255); rectMode(CENTER); rect(width/2, height/2, width * 0.6, height * 0.3, 20);
    fill(primaryCol); textAlign(CENTER, CENTER); textSize(22); textStyle(BOLD);
    text(selectedCourse, width/2, height/2 - 30);
    textSize(18); textStyle(NORMAL); text("教材開發中，敬請期待...", width/2, height/2 + 20);
    fill("#e74c3c");
    ellipse(width/2 + (width * 0.6)/2 - 30, height/2 - (height * 0.3)/2 + 30, 40, 40);
    fill(255); text("關閉", width/2 + (width * 0.6)/2 - 30, height/2 - (height * 0.3)/2 + 30);
    pop();
}

function drawBackButton() {
    let isHover = dist(mouseX, mouseY, 60, height - 60) < 35;
    push();
    translate(60, height - 60);
    if (isHover && !selectedCourse && !showNotice) { scale(1.1); fill(primaryCol); cursor(HAND); } 
    else { fill(accentCol); }
    ellipse(0, 0, 70, 70);
    fill(255); textAlign(CENTER, CENTER); textSize(18); text("返回", 0, 0);
    pop();
}

// --- 6. 互動事件 ---
function mousePressed() {
    if (showNotice) {
        let mW = 540; let mH = 400;
        let btnH = 45;
        let btnY = (height / 2 - mH / 2) + mH - 70;
        if (mouseX > width/2 - 80 && mouseX < width/2 + 80 && 
            mouseY > btnY && mouseY < btnY + btnH) {
            showNotice = false;
        }
        return;
    }
    if (selectedCourse) {
        let mW = width * 0.6; let mH = height * 0.3;
        if (dist(mouseX, mouseY, width/2 + mW/2 - 30, height/2 - mH/2 + 30) < 25) selectedCourse = null;
        return;
    }
    if (currentState === "MAIN_MENU" && dist(mouseX, mouseY, width / 2, 125) < 25) {
        showNotice = true;
        return;
    }
    if (currentState === "MAIN_MENU") {
        for (let btn of buttons) if (btn.isClicked(mouseX, mouseY)) currentState = btn.targetState;
    } else {
        if (dist(mouseX, mouseY, 60, height - 60) < 35) currentState = "MAIN_MENU";
        let startY = height * 0.35;
        let courses = (currentState === "SUPERVISOR_MENU") ? supervisorCourses : employeeCourses;
        for (let i = 0; i < courses.length; i++) {
            let y = startY + i * 105;
            if (mouseX > width/2 - 275 && mouseX < width/2 + 275 && mouseY > y - 40 && mouseY < y + 40) {
                selectedCourse = courses[i];
            }
        }
    }
}

function createMainButtons() {
    buttons = [];
    buttons.push(new MenuButton(width/2 - 180, height/2 + 100, 280, 160, "主管進階課程", "SUPERVISOR_MENU"));
    buttons.push(new MenuButton(width/2 + 180, height/2 + 100, 280, 160, "新進人員必修", "EMPLOYEE_MENU"));
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); createMainButtons(); }

// --- 7. 輔助類別 ---
class DecoParticle {
    constructor() { this.x = random(width); this.y = random(height); this.size = random(100, 250); this.vX = random(-0.5, 0.5); this.vY = random(-0.5, 0.5); }
    update() { this.x += this.vX; this.y += this.vY; if (this.x < 0 || this.x > width) this.vX *= -1; if (this.y < 0 || this.y > height) this.vY *= -1; }
    display() { noStroke(); fill(52, 152, 219, 15); ellipse(this.x, this.y, this.size); }
}

class MenuButton {
    constructor(x, y, w, h, l, s) { this.x = x; this.y = y; this.w = w; this.h = h; this.label = l; this.targetState = s; }
    display() {
        let hov = this.isOver();
        push();
        translate(this.x, this.y);
        rectMode(CENTER);
        if (hov && !selectedCourse && !showNotice) { scale(1.05); fill(accentCol); stroke(accentCol); cursor(HAND); } 
        else { fill(255); stroke(accentCol); strokeWeight(2); }
        rect(0, 0, this.w, this.h, 20);
        fill(hov && !selectedCourse && !showNotice ? 255 : primaryCol);
        textAlign(CENTER, CENTER);
        textSize(24); textStyle(BOLD); text(this.label, 0, 0);
        pop();
    }
    isOver() { return (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2); }
    isClicked(mx, my) { return this.isOver(); }
}