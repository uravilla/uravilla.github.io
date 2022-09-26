// see content-data.js file for the actual data to load content

function loadContent(currentColTimeline, data) {

    Object.keys(data).forEach(key => {
        let timelineItem = document.createElement('div');
        let year = document.createElement('span');
        let title = document.createElement('div');
        let text = document.createElement('div');

        timelineItem.className = 'timeline-item';
        year.className = 'year';
        title.className = 'item-title';
        text.className = 'text';

        year.innerText = data[key].year;
        title.innerText = data[key].title;
        text.innerText = data[key].text;

        timelineItem.append(year, title, text);

        if (data[key].text1) {
            let text1 = document.createElement('div');
            text1.className = 'text1';
            text1.innerText = data[key].text1;
            timelineItem.append(text1);
        }

        currentColTimeline.append(timelineItem);
    });
}

const EducationTimeline = document.querySelector('.column.Education .timeline');
const WorkTimeline = document.querySelector('.column.Work .timeline');

EducationTimeline && loadContent(EducationTimeline, Education);
WorkTimeline && loadContent(WorkTimeline, workExperiences);

function loadSkills(skillsCol, skills) {
    Object.keys(skills).forEach(key => {
        let skillDiv = document.createElement('div');
        let progress = document.createElement('div');
        let progbar = document.createElement('div');
        let textDiv = document.createElement('div');
        let name = document.createElement('span');
        let perct = document.createElement('span');

        skillDiv.className = 'skill';
        progbar.className = 'progress-bar';
        progress.className = 'progress-color';
        textDiv.className = 'skill-text';
        perct.className = 'skill-perct';

        name.innerText = skills[key].name;
        perct.innerText = skills[key].score + '%';
        progress.style.setProperty('--width', `${skills[key].score}%`);

        textDiv.append(name, perct);
        progbar.append(progress);
        skillDiv.append(textDiv, progbar);
        skillsCol.append(skillDiv);
    });
}

const SkillsCol = document.querySelector('.skills-page .column');
SkillsCol && loadSkills(SkillsCol, skills);
let x, y = null;

function loadExperiences(Experiences, tabUL, tabContentArea, data_prefix = '') {
    Object.keys(Experiences).forEach((key, index) => {
        // for tabs
        let li = document.createElement('li');
        index === 0 ? li.className = 'active' : '';
        li.title = Experiences[key].name;
        li.innerText = Experiences[key].abbr ? Experiences[key].abbr : Experiences[key].name;
        li.setAttribute('data-name', data_prefix + key);
        tabUL.append(li);

        // now for the content part
        let section = document.createElement('section');
        let spanTitle = document.createElement('span');
        let h4 = document.createElement('h4');
        let time = document.createElement('span');
        let tools = document.createElement('span');
        let ul = document.createElement('ul');

        Object.values(Experiences[key].texts).forEach(text => {
            let li = document.createElement('li');
            li.innerText = text;
            ul.appendChild(li);
        });

        section.className = index === 0 ? 'section active' : 'section';
        section.setAttribute('data-id', data_prefix + key);
        spanTitle.className = 'item-title';
        time.className = 'time';
        tools.className = Experiences[key].tool ? 'tools' : '';

        spanTitle.innerText = Experiences[key].role ? Experiences[key].role + ' @ ' : '';
        h4.innerText = Experiences[key].name;
        time.innerText = Experiences[key].year;
        tools.innerText = Experiences[key].tool ? Experiences[key].tool : '';

        spanTitle.append(h4);
        section.append(spanTitle, time, tools, ul);
        tabContentArea.append(section);
    });
}

const tabULExp = document.querySelector('.Experience .tabs ul');
const tabContentExp = document.querySelector('.Experience .content');
const tabULProj = document.querySelector('.Project .tabs ul');
const tabContentProj = document.querySelector('.Project .content');

tabULExp && tabContentExp && loadExperiences(Experiences, tabULExp, tabContentExp, 'exp');
tabULProj && tabContentProj && loadExperiences(Projects, tabULProj, tabContentProj, 'proj');

function showSectionContent(contentEle) {
    let allSectionEle = contentEle.parentElement.querySelectorAll('.section');
    allSectionEle.forEach(section => {
        section.classList.remove('active');
    })
    x && document.removeEventListener('transitionend', x);
    x = document.ontransitionend = () => {
        contentEle && contentEle.classList.add('active');
    }
    y && window.clearTimeout(y);
    y = setTimeout(() => {
        contentEle && contentEle.classList.add('active');
    }, 1000);

}

function enableTabs(TabButtons) {
    TabButtons.forEach(button => {
        let tabData = button.getAttribute('data-name');
        let contentSection = document.querySelector(`.tab-view [data-id="${tabData}"]`);
        button.onclick = () => {
            TabButtons.forEach(button => button.classList.remove('active'));
            button.classList.add('active');
            showSectionContent(contentSection);
            let ul = button.parentElement;
            let indexNum = Array.from(ul.children).indexOf(button);
            let sliderIndicator = ul.parentElement.querySelector('.slider .indicator');
            sliderIndicator.style.transform = `translateY(calc(${indexNum}*100%))`;
        }
    });
}

let TabBtnsExp = document.querySelectorAll('.Experience .tabs ul li');
let TabBtnsProj = document.querySelectorAll('.Project .tabs ul li');

enableTabs(TabBtnsExp);
enableTabs(TabBtnsProj);

// for smaller devices and resizes,
function sizeContentSection() {
    document.querySelectorAll('.tab-view .content').forEach(contentSection => {
        let maxSize = 0;
        Array.from(contentSection.children).forEach(child => {
            child.scrollHeight > maxSize ? maxSize = child.scrollHeight : maxSize = maxSize;
        });
        contentSection.style.setProperty('--min-height', maxSize + 'px');
    });
}

setTimeout(() => {
    sizeContentSection();
}, 1000);

window.onresize = sizeContentSection;

// for sidebar open close
let hamburger = document.querySelector('header .bars');
let mainnav = document.querySelector('.main-nav');
hamburger.onclick = () => {
    hamburger.classList.toggle('open');
    mainnav.classList.toggle('open');
}