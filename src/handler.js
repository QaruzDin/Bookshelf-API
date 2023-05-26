/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount,
    readPage, reading} = request.payload;
  const id = nanoid(16);

  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage,
    finished, reading,
    insertedAt, updatedAt,
  };


  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
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
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const {reading, finished, name} = request.query;

  let filteredBooks = books;

  if (reading !== undefined) {
    filteredBooks = books.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    filteredBooks = books.filter((book) => book.finished === (finished === '1'));
  }

  if (name !== undefined) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes('dicoding'));
  }

  if (filteredBooks.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    let errorMessage = '';
    if (reading !== undefined && (reading !== '0' && reading !== '1')) {
      errorMessage = 'Parameter reading yang diminta tidak sesuai';
    } else if (finished !== undefined && (finished !== '0' && finished !== '1')) {
      errorMessage = 'Parameter finished yang diminta tidak sesuai';
    } else if (search !== undefined) {
      errorMessage = 'Tidak ada buku yang ditemukan dengan nama yang mengandung "Dicoding"';
    } else {
      errorMessage = 'Tidak ada buku yang ditemukan';
    }

    const response = h.response({
      status: 'fail',
      message: errorMessage,
    });
    response.code(400);
    return response;
  }
};


const getBookByIdHandler = (request, h) => {
  const {id} =request.params;

  const book = books.filter((book) => book.id === id) [0];

  if (book !== undefined) {
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
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const {name, year, author, summary, publisher, pageCount,
    readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  let finished = false;

  if (index !== -1) {
    if (pageCount === readPage) {
      finished = true;
    } else if (pageCount > readPage) {
      finished = false;
    }

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }


  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler,
  editBookByIdHandler, deleteBookByIdHandler};
