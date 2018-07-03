const fs = require("fs");
const people = require("./data/projects.json");
const hbs = require("handlebars");
const markdown = require('helper-markdown');
const {updatePage} = require("./wordpress");

hbs.registerHelper('markdown', markdown({}));
hbs.registerHelper('stubify', (p)=> {
    return p.toLowerCase().replace(/ /g, "-");
});

people.forEach(p => {
    const {name, projects} = p;
    let newRL = `data/people/${name}`;
    if (fs.existsSync(newRL + "/bio.md")) {
        p.bio = fs.readFileSync(newRL + "/bio.md").toString()
    } else {
        p.bio = `${p.name} has many skills, but writing bios appears to not be one of them.`
    }

    Object.keys(projects).forEach((k) => {
        const v = projects[k];
        const pData = {};
        pData.name = v;
        pData.text = fs.readFileSync(`data/projects/${v}/bio.md`).toString();
        const projectPDF = fs.readFileSync(`data/projects/${v}/url.txt`).toString().trim();
        if (projectPDF !== "") {
            pData.pdf = projectPDF;
        }
        p.projects[k] = pData
    })
});

const template = hbs.compile(fs.readFileSync("hbs/person.hbs").toString());
const indexTemplate = hbs.compile(fs.readFileSync("hbs/listing.hbs").toString());

people.forEach(p => {
    const {pageID, name} = p;
    const html = template(p);
    fs.writeFileSync(`out/${name}.html`, html);
    updatePage(pageID, html);
});


const structuredPeople = {};

people.forEach((person) => {
    Object.keys(person.projects).forEach((year) => {
        if (!(year in structuredPeople)) {
            structuredPeople[year] = []
        }
        structuredPeople[year].push(person)
    })
});
let listingHTML = indexTemplate(structuredPeople);
fs.writeFileSync(`out/index.html`, listingHTML);
updatePage(1803, listingHTML);