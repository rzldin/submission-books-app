const { nanoid } = require('nanoid');
const books = require('./books');


// untuk menambahkan buku baru
const addBookHandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,    
    } = request.payload;

    // apabila client tidak melampirkan properti name, pada request body
    if (name == null || name.trim().length === 0) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
        return response;
    }

    // apabila client melampirkan nilai properti readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
        return response;
    }
    
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;


    
    const newBook = {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,  
    };
    
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
 
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
    return response;
};

// untuk menampilkan semua data buku
const getAllBooksHandler = (request, h) => {
    let booksFilter = [];

    const {
        name,
        reading,
        finished,
    } = request.query;

    if (!name && !reading && !finished) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,

                })),
            },
        })
        .code(200);
        return response;
    }

    // query untuk mendapatkan data, berdasarkan nama buku
    if (name) {
        booksFilter = books.filter(
            (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    // query untuk mendapatkan data, berdasarkan reading
   
    if (reading) {
        booksFilter = books.filter(
            (book) => Number(book.reading) === Number(reading),
        );
    }

    // query untuk mendapatkan data, berdasarkan finished
    if (finished) {
        booksFilter = books.filter(
            (book) => Number(book.finished) === Number(finished),
        );
    }

    const response = h.response({
        status: 'success',
        data: {
            books: booksFilter.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,

            })),
        },
    })
    .code(200);

    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    
    const book = books.filter((val) => val.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
              book,
            },
          })
          .code(200);
          return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
      return response;
};


// untuk mengedit data buku
const editBookHandler = (request, h) => {
    const { bookId } = request.params;

    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,    
    } = request.payload;

     // apabila client tidak melampirkan properti name, pada request body
    if (name == null || name.trim().length === 0) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
        return response;
    }

     // apabila client melampirkan nilai properti readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
        .code(200);
        return response;
    }

    // response jika id tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
    return response;
};

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
        .code(200);
        return response;
    }

    // response jika id buku tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
    return response;
};


module.exports = { 
    getAllBooksHandler, 
    addBookHandler, 
    getBookByIdHandler, 
    editBookHandler, 
    deleteBookHandler,
};