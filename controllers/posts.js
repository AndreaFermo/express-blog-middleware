const posts = require("../db/db.json");
const path = require("path");
const fs = require("fs");
const { kebabCase } = require("lodash");

function index(req, res) {
    res.format({
        html: () => {
            html = [];

            html.push("<ul>");

            for (const post of posts) {
                html.push(`
                <li>
                    <h3>${post.title}</h3>
                    <img src="/posts/${post.slug}/image" alt="${post.title}" style="width: 100px">
                </li>
            `);
            }

            html.push("</ul>");

            res.send(html.join(""));
        }
    })
};

function show(req, res) {
    res.format({
        json: () => {
            const post = findOrFail(req, res);

            post.image_url = `/posts/${post.slug}/image`;

            post.download_image_url = `/posts/${post.slug}/download`;

            res.send(post);
        }
    });

};

function create(req, res) {
    res.format({
        html: () => {
            html = "<h1>Creazione nuovo post</h1>"
            res.send(html);
        },
        default: () => {
            res.status(406).send("Not Acceptable");
        }
    })
};

function store(req, res) {
    res.format({
        html: () => {
            res.redirect("/");
        },
        default: () => {
            posts.push({
                ...req.body,
                slug: kebabCase(req.body.title),
                updatedAt: new Date().toISOString(),
                image: req.file
            });

            const json = JSON.stringify(posts, null, 2);

            fs.writeFileSync(path.resolve(__dirname, "..", "db", "db.json"), json)

            res.json(posts[posts.length - 1]);
        }
    })

};

function destroy(req, res) {
    res.format({
        html: () => {
            res.redirect("/");
        },
        default: () => {
            const post = findOrFail(req, res);

            const postIndex = posts.findIndex((_post) => _post.slug == post.slug);

            posts.splice(postIndex, 1);

            if (post.image) {
                if (typeof post.image === "string") {
                    const filePath = path.resolve(
                        __dirname,
                        "..",
                        "public",
                        "imgs",
                        "posts",
                        post.image
                    );

                    fs.unlinkSync(filePath);
                } else {
                    const filePath = path.resolve(__dirname, "..", post.image.path);

                    fs.unlinkSync(filePath);
                }
            }
            const json = JSON.stringify(posts, null, 2);
            fs.writeFileSync(path.resolve(__dirname, "..", "db", "db.json"), json);

            res.send("Post eliminato");
        }
    })

};

function showImage(req, res) {
    const post = findOrFail(req, res);

    if (typeof post.image === "string") {
        const filePath = path.resolve(__dirname, "../public/imgs/posts", post.image);

        res.sendFile(filePath);

        return;
    }

    const filePath = path.resolve(__dirname, "..", post.image.path);

    res.append("Content-Type", post.image.mimetype);

    res.sendFile(filePath);

};

function downloadImage(req, res) {
    const post = findOrFail(req, res);

    if (typeof post.image === "string") {
        const filePath = path.resolve(__dirname, "../public/imgs/posts", post.image);

        res.download(filePath);

        return;
    }

    const filePath = path.resolve(__dirname, "..", post.image.path);

    res.append("Content-Type", post.image.mimetype);

    res.download(filePath);
};

function findOrFail(req, res) {

    const postSlug = req.params.slug;

    const post = posts.find((post) => post.slug == postSlug);

    if (!post) {
        res.status(404).send(`Post con slug ${postSlug} non trovato!`);
        return;
    }

    return post;
}

module.exports = {
    index,
    show,
    create,
    store,
    destroy,
    showImage,
    downloadImage
}