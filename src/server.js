const Hapi = require('@hapi/hapi');
const { addBook, getBooks, getBook } = require('./data');

async function run() {
    const server = Hapi.server({
        host: 'localhost',
        port: 9000
    });

    server.route([
        {
            method: 'POST',
            path: '/books',
            handler: (request, h) => {
                const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
                
                if (!name) {
                    const response = h.response({
                        status: "fail",
                        message: "Gagal menambahkan buku. Mohon isi nama buku"
                    });
                    response.code(400);
                    return response;
                }

                if (readPage > pageCount) {
                    const response = h.response({
                        status: "fail",
                        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                    });
                    response.code(400);
                    return response;
                }

                const id = addBook({ name, year, author, summary, publisher, pageCount, readPage, reading });
                const response = h.response({
                    status: "success",
                    message: "Buku berhasil ditambahkan",
                    data: { bookId: id },
                });
                response.code(201); 
                return response;
            }
        },

        {
            method: 'GET',
            path: '/books',
            handler: () => {
                const books = getBooks();
                return { 
                    status: "success",
                    data: { 
                        books 
                    },
                }
            }
        },

        {
            method: 'GET',
            path: '/books/{bookId}',
            handler: (request, h) => {
                const { bookId } = request.params;
                const book = getBook(bookId);
        
                if (!book) {
                    const response = h.response({
                        status: 'fail',
                        message: 'Buku tidak ditemukan',
                    });
                    response.code(404);
                    return response;
                }
        
                return {
                    status: 'success',
                    data: {
                        book,
                    },
                };
            },
        },        
    ]);

    await server.start();

    console.log('Server running on %s', server.info.uri);
}

run();
