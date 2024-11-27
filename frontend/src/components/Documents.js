import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Documents.css';
const moment = require('moment');

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDoc, setNewDoc] = useState({ name: '', content: '' });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');
  const [message, setMessage] = useState(''); // For success or error message below the create button

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Number of documents per page

  // Fetch documents with pagination, search, and sort
  const fetchDocuments = useCallback(() => {
    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/documents', {
        params: {
          search,
          sort_by: sortBy,
          sort_order: sortOrder,
          page: currentPage,
          page_size: pageSize,
        },
      })
      .then((response) => {
        setDocuments(response.data.documents);
        setTotal(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the documents!', error);
        setError('Failed to load documents. Please try again later.');
        setLoading(false);
      });
  }, [search, sortBy, sortOrder, currentPage, pageSize]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]); // Now fetchDocuments is properly memoized and used in the dependency array

  // Handle document deletion and update total
  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/documents/${id}`)
      .then(() => {
        fetchDocuments();
        const updatedDocuments = documents.filter((doc) => doc.id !== id);
        setDocuments(updatedDocuments);
        setTotal(total - 1); // Update the total count after deletion

        // If the deleted document was the only document on the current page, go to the previous page
        if (updatedDocuments.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1); // Go to the previous page
        }

        setMessage('Document deleted successfully!');
        setTimeout(() => {
            setMessage(''); // Hide message after 5 seconds
          }, 5000); // 5 seconds timeout
        if (selectedDoc?.id === id) {
          setSelectedDoc(null); // Clear selected document if it's deleted
        }
      })
      .catch((error) => {
        console.error('There was an error deleting the document!', error);
        setError('Failed to delete document. Please try again later.');
        setMessage('Failed to delete document.');
        setTimeout(() => {
            setMessage(''); // Hide message after 5 seconds
          }, 5000); // 5 seconds timeout

      });
  };

  // Handle document creation and trigger a refetch to update the list
  const handleCreate = () => {
    if (newDoc.name && newDoc.content) {
      axios
        .post('http://127.0.0.1:8000/api/documents', newDoc)
        .then(() => {
          fetchDocuments(); // Refetch documents after creation
          setNewDoc({ name: '', content: '' });
          setMessage('Document created successfully!');
          setTimeout(() => {
            setMessage(''); // Hide message after 5 seconds
          }, 5000); // 5 seconds timeout
        })
        .catch((error) => {
          console.error('There was an error creating the document!', error);
          setError('Failed to create document. Please try again later.');
          setMessage('Failed to create document.');
          setTimeout(() => {
            setMessage(''); // Hide message after 5 seconds
          }, 5000); // 5 seconds timeout
        });
    } else {
      setError('Please provide both name and content for the document.');
      setMessage('Failed to create document. Both name and content are required.');
    }
  };

  // Toggle document content visibility (show only the selected document)
  const handleDocClick = (doc) => {
    setSelectedDoc((prevSelectedDoc) => {
      return prevSelectedDoc?.id === doc.id ? null : doc;
    });
  };

  // Pagination state and logic
  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Documents List (Total: {total})</h2>

      {/* Create Document Form */}
      <div className="create-form">
        <h3>Create New Document</h3>
        <input
          type="text"
          placeholder="Document Name"
          value={newDoc.name}
          onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
        />
        <textarea
          placeholder="Document Content"
          value={newDoc.content}
          onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
        {/* Show success or error message below the create button */}
        {message && <p>{message}</p>}
      </div>

      {/* Search and Sort */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="name">Name</option>
          <option value="created_at">Created At</option>
          <option value="size">Size</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Document Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size (KB)</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>
                <button onClick={() => handleDocClick(doc)}>{doc.name}</button>
              </td>
              <td>{doc.size}</td>
              <td>
                {moment.utc(doc.created_at).local().format('ddd, MMM D, YYYY h:mm A')}
              </td>
              <td>
                <button onClick={() => handleDelete(doc.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span className='page'>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Display content of selected document */}
      {selectedDoc && (
        <div className="document-content">
          <h3>Document Content</h3>
          <h4 className="docu-name">{selectedDoc.name}</h4>
          <p>{selectedDoc.content}</p>
        </div>
      )}
    </div>
  );
};

export default Documents;
