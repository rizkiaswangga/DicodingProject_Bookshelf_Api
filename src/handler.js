const books = require('./books');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    const correctRequirements = ( ( newBook.name !== undefined ) && newBook.readPage <= newBook.pageCount);

    if (correctRequirements === false) {

        if ( newBook.name == undefined ){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            });

            response.code(400);
            return response;
        }

        if ( newBook.readPage > newBook.pageCount ){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });

            response.code(400);
            return response;
        }
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = () => {
    const displayTotalSummarizedBooks = books.map(books => ({
        id: books.id,
        name: books.name,
        publisher: books.publisher
    }));

    return {
        status: "success",
        data: {
            books: displayTotalSummarizedBooks
        }
    };
};

const getBookByIdHandler = (request, h) => {
    console.log(request.params);
    const { bookId }  = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
}
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };