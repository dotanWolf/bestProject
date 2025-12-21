const { title } = require("process");


// const articles = [
//     {
//         id : 1,
//         title: 'My cake',
//         author: 'John Doe',
//         published: 'Febuary 11, 2024',
//         content: 'Lorem ipsum'
//     },
//     {
//         id : 2,
//         title: 'Not my cake',
//         author: 'Not John Doe',
//         published: 'Not Febuary 11, 2024',
//         content: 'Not Lorem ipsum'
//     }
// ]

// var numArticles = articles.length

// const getArticle = (id) => {
//     return articles.filter((article) => article.id == id)[0]
// }

// const getAllArticles = () => articles

// const createArticle = (title, author, published, content) => {
//     const newArticle = {id : ++numArticles, title, author, published, content}
//     articles.push(newArticle)
//     return newArticle
// }

// const updateArticle = (id, title, author, published, content) => {
//     const index = articles.findIndex(article => article.id == id);
//     if (index === -1) {
//         return null;
//     }    
//     const newArticle = {id , title, author, published, content}
//     articles[index] = newArticle
//     return newArticle
// }

// const deleteArticle = (id) => {
//     const index = articles.findIndex(article => article.id == id);
//     if (index === -1) {
//         return false;
//     }
//     articles.splice(index, 1)
//     return true;
// }


module.exports = { 
    getArticle,
    getAllArticles, 
    createArticle, 
    updateArticle, 
    deleteArticle 
}