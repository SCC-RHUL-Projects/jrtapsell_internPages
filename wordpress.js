const wordpress = require("wordpress");

const client = wordpress.createClient({
    url: "https://scc.rhul.ac.uk",
    username: process.env["WP_USER"],
    password: process.env["WP_PASS"],
    rejectUnauthorized: false
});

module.exports = {updatePage: (id, content) => {
        client.editPost(id, {"content": content}, (err) => {
            if (err) {
                console.log("Failed", err)
            }
        })
    }
};