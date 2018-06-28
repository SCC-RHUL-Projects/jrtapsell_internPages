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
    const {name, project} = p;
    let newRL = `data/people/${name}`;
    const projectText = fs.readFileSync(`data/projects/${project}/bio.md`).toString();
    if (fs.existsSync(newRL + "/bio.md")) {
            p.bio = fs.readFileSync(newRL + "/bio.md").toString()
    } else {
            p.bio = `${p.name} has many skills, but writing bios appears to not be one of them.`
    }
    p.projectText = projectText;
});

const template = hbs.compile(fs.readFileSync("hbs/person.hbs").toString());
const indexTemplate = hbs.compile(fs.readFileSync("hbs/listing.hbs").toString());

people.forEach(p => {
    const {pageID, name} = p;
    const html = template(p);
    fs.writeFileSync(`out/${name}.html`, html);
    updatePage(pageID, html);
});

let listingHTML = indexTemplate(people);
fs.writeFileSync(`out/index.html`, listingHTML);
updatePage(1803, listingHTML);